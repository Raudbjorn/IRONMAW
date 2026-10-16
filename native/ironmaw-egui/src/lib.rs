//! IRONMAW (Wormian Bones) for egui.
//!
//! The same design tokens as the Svelte library, generated into [`tokens`]
//! by `scripts/build-egui.mjs`. This crate turns them into an egui
//! [`Style`], installs the IRONMAW fonts, and offers small builders for the
//! places where egui's defaults are too tight for long working sessions
//! (text-field margins, label-to-field gaps, line spacing).
//!
//! ```no_run
//! # fn demo(ctx: &egui::Context, ui: &mut egui::Ui, name: &mut String) {
//! ironmaw_egui::install(ctx, ironmaw_egui::Edition::Oxide);
//! ironmaw_egui::field(ui, "Full name", |ui| ui.add(ironmaw_egui::text_field(name)));
//! # }
//! ```
//!
//! Rules carried over from the design system: teal is interactive and
//! selection, rust is the one main action per view, amber marks things to
//! review (never rust), the display face (Rajdhani) is for short uppercase
//! labels only, and Icelandic text renders in Inter.

pub mod tokens;

use std::sync::Arc;

use egui::{
    epaint::Shadow,
    style::{Selection, TextCursorStyle, WidgetVisuals, Widgets},
    Button, Color32, CornerRadius, FontData, FontDefinitions, FontFamily, FontId, Frame, Margin,
    RichText, Stroke, Style, TextEdit, TextStyle, Theme, Ui, Vec2, Visuals,
};

pub use tokens::{brand, scale, Palette, BONE, OXIDE};

/// The two editions. Oxide is the default; Bone is the paper edition used
/// for documents (and available as a light UI, though not yet approved).
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub enum Edition {
    #[default]
    Oxide,
    Bone,
}

impl Edition {
    pub fn palette(self) -> Palette {
        match self {
            Edition::Oxide => OXIDE,
            Edition::Bone => BONE,
        }
    }

    fn theme(self) -> Theme {
        match self {
            Edition::Oxide => Theme::Dark,
            Edition::Bone => Theme::Light,
        }
    }
}

/// Font family names registered by [`fonts`]. `Proportional` is Inter
/// Regular and `Monospace` is Iosevka.
pub mod family {
    /// Inter Medium: emphasis inside running text, field values that need weight.
    pub const MEDIUM: &str = "ironmaw-inter-medium";
    /// Inter SemiBold: titles, names, document headings.
    pub const STRONG: &str = "ironmaw-inter-semibold";
    /// Rajdhani SemiBold: short uppercase labels (tabs, kickers, section labels).
    pub const DISPLAY: &str = "ironmaw-rajdhani-semibold";
    /// Rajdhani Bold: the active tab, the primary action, the wordmark.
    pub const DISPLAY_BOLD: &str = "ironmaw-rajdhani-bold";
}

/// Native type sizes in points. The desktop app reads at 16 pt UI text and
/// 18 pt prose (see the workflow design notes), so these sit one step above
/// the web list sizes.
pub mod size {
    use crate::scale;
    pub const SMALL: f32 = scale::FS_SM; // 13
    pub const UI: f32 = scale::FS_LG; // 16
    pub const PROSE: f32 = scale::FS_XL; // 18
    pub const TITLE: f32 = scale::FS_2XL; // 22
    pub const HEADLINE: f32 = scale::FS_3XL; // 28
    pub const LABEL: f32 = scale::FS_SM; // 13, display face
    pub const MONO: f32 = scale::FS_BASE; // 14
}

/// Line heights in points for the sizes above (token leading × size). Pass
/// them to [`RichText::line_height`] or use the [`text`] helpers.
pub mod leading {
    use super::{scale, size};
    pub const SMALL: f32 = size::SMALL * scale::LH_NORMAL;
    pub const UI: f32 = size::UI * scale::LH_NORMAL;
    pub const PROSE: f32 = size::PROSE * scale::LH_RELAXED;
    pub const TITLE: f32 = size::TITLE * scale::LH_TIGHT;
    pub const HEADLINE: f32 = size::HEADLINE * scale::LH_TIGHT;
}

/// Inter, Iosevka and Rajdhani subsets (Latin, Latin-1, Latin Extended-A:
/// Icelandic included), embedded. Inter and Iosevka also keep egui's default
/// fonts as fallbacks for symbols.
pub fn fonts() -> FontDefinitions {
    let mut defs = FontDefinitions::default();
    let mut add = |name: &str, bytes: &'static [u8]| {
        defs.font_data.insert(name.to_owned(), Arc::new(FontData::from_static(bytes)));
    };
    add("inter-regular", include_bytes!("../fonts/Inter-Regular.ttf"));
    add("inter-medium", include_bytes!("../fonts/Inter-Medium.ttf"));
    add("inter-semibold", include_bytes!("../fonts/Inter-SemiBold.ttf"));
    add("rajdhani-semibold", include_bytes!("../fonts/Rajdhani-SemiBold.ttf"));
    add("rajdhani-bold", include_bytes!("../fonts/Rajdhani-Bold.ttf"));
    add("iosevka-regular", include_bytes!("../fonts/Iosevka-Regular.ttf"));

    let fallbacks: Vec<String> = defs.families.get(&FontFamily::Proportional).cloned().unwrap_or_default();
    let with_fallbacks = |first: &str| {
        let mut v = vec![first.to_owned()];
        v.extend(fallbacks.iter().cloned());
        v
    };
    defs.families.insert(FontFamily::Proportional, with_fallbacks("inter-regular"));
    defs.families.insert(FontFamily::Name(family::MEDIUM.into()), with_fallbacks("inter-medium"));
    defs.families.insert(FontFamily::Name(family::STRONG.into()), with_fallbacks("inter-semibold"));
    defs.families.insert(FontFamily::Name(family::DISPLAY.into()), with_fallbacks("rajdhani-semibold"));
    defs.families.insert(FontFamily::Name(family::DISPLAY_BOLD.into()), with_fallbacks("rajdhani-bold"));
    let mut mono = vec!["iosevka-regular".to_owned()];
    mono.extend(defs.families.get(&FontFamily::Monospace).cloned().unwrap_or_default());
    defs.families.insert(FontFamily::Monospace, mono);
    defs
}

fn r(px: f32) -> CornerRadius {
    CornerRadius::same(px.round() as u8)
}

fn m(px: f32) -> i8 {
    px.round().clamp(0.0, 127.0) as i8
}

fn widget(bg: Color32, weak_bg: Color32, stroke: Stroke, fg: Color32) -> WidgetVisuals {
    WidgetVisuals {
        bg_fill: bg,
        weak_bg_fill: weak_bg,
        bg_stroke: stroke,
        corner_radius: r(scale::RADIUS_SM),
        fg_stroke: Stroke::new(1.0, fg),
        expansion: 0.0,
    }
}

/// egui visuals for an edition.
pub fn visuals(edition: Edition) -> Visuals {
    let p = edition.palette();
    let mut v = match edition {
        Edition::Oxide => Visuals::dark(),
        Edition::Bone => Visuals::light(),
    };
    v.override_text_color = None;
    v.widgets = Widgets {
        noninteractive: widget(p.bg, p.surface_1, Stroke::new(1.0, p.border), p.text),
        inactive: widget(p.surface_1, p.surface_1, Stroke::new(1.0, p.border_strong), p.text),
        hovered: widget(p.surface_2, p.surface_2, Stroke::new(1.0, p.text_muted), p.text_strong),
        active: widget(p.surface_3, p.surface_3, Stroke::new(1.5, p.accent), p.text_strong),
        open: widget(p.surface_2, p.surface_2, Stroke::new(1.0, p.border_strong), p.text_strong),
    };
    v.selection = Selection { bg_fill: p.accent.gamma_multiply(0.35), stroke: Stroke::new(1.0, p.accent) };
    v.hyperlink_color = p.accent;
    v.faint_bg_color = p.surface_1;
    v.extreme_bg_color = p.surface_1;
    v.text_edit_bg_color = Some(p.surface_1);
    v.code_bg_color = p.surface_2;
    v.warn_fg_color = p.warning;
    v.error_fg_color = p.error;
    v.panel_fill = p.bg;
    v.window_fill = p.surface_2;
    v.window_stroke = Stroke::new(1.0, p.border_strong);
    v.window_corner_radius = r(scale::RADIUS_MD);
    v.menu_corner_radius = r(scale::RADIUS_MD);
    v.window_shadow = Shadow { offset: [0, 6], blur: 16, spread: 0, color: Color32::from_black_alpha(102) };
    v.popup_shadow = Shadow { offset: [0, 4], blur: 12, spread: 0, color: Color32::from_black_alpha(90) };
    v.text_cursor = TextCursorStyle { stroke: Stroke::new(2.0, p.accent), ..v.text_cursor };
    v
}

/// The full egui style for an edition: visuals, type scale and spacing.
pub fn style(edition: Edition) -> Style {
    let mut s = Style { visuals: visuals(edition), ..Style::default() };
    s.text_styles = [
        (TextStyle::Small, FontId::new(size::SMALL, FontFamily::Proportional)),
        (TextStyle::Body, FontId::new(size::UI, FontFamily::Proportional)),
        (TextStyle::Button, FontId::new(size::UI - 1.0, FontFamily::Name(family::MEDIUM.into()))),
        (TextStyle::Heading, FontId::new(size::TITLE, FontFamily::Name(family::STRONG.into()))),
        (TextStyle::Monospace, FontId::new(size::MONO, FontFamily::Monospace)),
    ]
    .into();

    let sp = &mut s.spacing;
    // Generous by design: the owner found egui's defaults cramped.
    sp.item_spacing = Vec2::new(scale::SPACE_2, scale::SPACE_3 - 2.0); // 8 × 10
    sp.button_padding = Vec2::new(scale::CONTROL_PAD_X, scale::SPACE_2); // 12 × 8
    sp.interact_size = Vec2::new(scale::CONTROL_MD, scale::CONTROL_SM + 4.0); // 40 × 36
    sp.window_margin = Margin::same(m(scale::SPACE_6)); // 24
    sp.menu_margin = Margin::same(m(scale::SPACE_2));
    sp.indent = scale::SPACE_4;
    sp.icon_spacing = scale::SPACE_2;
    sp.text_edit_width = 280.0;
    // Inter's row height is about 1.21 × the size; this brings UI text to
    // about 1.5 and keeps wrapped labels and text areas from crowding.
    sp.extra_text_line_spacing = (leading::UI - size::UI * 1.21).round();
    s
}

/// Install fonts and the edition's style, and select the matching theme.
pub fn install(ctx: &egui::Context, edition: Edition) {
    ctx.set_fonts(fonts());
    ctx.set_style_of(edition.theme(), style(edition));
    ctx.set_theme(edition.theme());
}

/// Text in the system's roles, with line heights from the tokens.
pub mod text {
    use super::*;

    fn rt(s: impl Into<String>, size: f32, family: FontFamily, lh: f32) -> RichText {
        RichText::new(s).font(FontId::new(size, family)).line_height(Some(lh.round()))
    }

    /// Interface text, 16 pt at 1.5.
    pub fn body(s: impl Into<String>) -> RichText {
        rt(s, size::UI, FontFamily::Proportional, leading::UI)
    }
    /// Reading text (excerpts, help, CV passages), 18 pt at 1.65.
    pub fn prose(s: impl Into<String>) -> RichText {
        rt(s, size::PROSE, FontFamily::Proportional, leading::PROSE)
    }
    /// Hints and metadata, 13 pt at 1.5.
    pub fn small(s: impl Into<String>) -> RichText {
        rt(s, size::SMALL, FontFamily::Proportional, leading::SMALL)
    }
    /// Titles and names (never uppercased), 22 pt SemiBold.
    pub fn title(s: impl Into<String>) -> RichText {
        rt(s, size::TITLE, FontFamily::Name(family::STRONG.into()), leading::TITLE)
    }
    /// A short display label: Rajdhani, uppercase, tracked. Labels only.
    pub fn label(s: impl AsRef<str>) -> RichText {
        RichText::new(s.as_ref().to_uppercase())
            .font(FontId::new(size::LABEL, FontFamily::Name(family::DISPLAY.into())))
            .extra_letter_spacing(size::LABEL * scale::TRACKING_DISPLAY_EM)
    }
    /// Paths, identifiers, counts.
    pub fn mono(s: impl Into<String>) -> RichText {
        rt(s, size::MONO, FontFamily::Monospace, size::MONO * scale::LH_NORMAL)
    }
}

/// A single-line text field with room around its text (12 × 10 pt margins).
pub fn text_field(text: &mut String) -> TextEdit<'_> {
    TextEdit::singleline(text).margin(Margin::symmetric(m(scale::CONTROL_PAD_X), m(scale::SPACE_2)))
}

/// A multi-line text field (12 × 10 pt margins; line spacing from the style).
pub fn text_area(text: &mut String) -> TextEdit<'_> {
    TextEdit::multiline(text)
        .margin(Margin::symmetric(m(scale::CONTROL_PAD_X), m(scale::FIELD_PAD_Y)))
        .desired_rows(4)
}

/// A labelled field: the label, 8 pt, the control, then 16 pt to the next field.
pub fn field<R>(ui: &mut Ui, label: &str, add: impl FnOnce(&mut Ui) -> R) -> R {
    let p = palette_of(ui);
    ui.label(text::small(label).color(p.text_muted));
    ui.add_space(scale::FIELD_LABEL_GAP - ui.spacing().item_spacing.y);
    let out = add(ui);
    ui.add_space(scale::FIELD_GAP - ui.spacing().item_spacing.y);
    out
}

/// The one main action per view: rust fill, charcoal label in the display face.
pub fn primary_button(label: &str, edition: Edition) -> Button<'static> {
    let p = edition.palette();
    Button::new(
        RichText::new(label.to_uppercase())
            .font(FontId::new(size::UI - 1.0, FontFamily::Name(family::DISPLAY_BOLD.into())))
            .extra_letter_spacing(0.8)
            .color(p.action_ink),
    )
    .fill(p.action)
    .stroke(Stroke::NONE)
    .min_size(Vec2::new(0.0, scale::CONTROL_MD))
}

/// A secondary action: slate outline, Inter label (sentence case).
pub fn secondary_button(label: &str) -> Button<'static> {
    Button::new(RichText::new(label)).min_size(Vec2::new(0.0, scale::CONTROL_SM + 4.0))
}

/// The paper sheet for documents: Bone ground, page margin, soft shadow.
pub fn paper_frame() -> Frame {
    Frame::new()
        .fill(BONE.bg)
        .inner_margin(Margin::same(m(scale::PAGE_MARGIN)))
        .shadow(Shadow { offset: [0, 6], blur: 16, spread: 0, color: Color32::from_black_alpha(102) })
}

/// A dialog or raised panel: surface-2, slate outline, 24 pt padding.
pub fn dialog_frame(edition: Edition) -> Frame {
    let p = edition.palette();
    Frame::new()
        .fill(p.surface_2)
        .stroke(Stroke::new(1.0, p.border_strong))
        .corner_radius(r(scale::RADIUS_MD))
        .inner_margin(Margin::same(m(scale::SPACE_6)))
}

/// The palette matching the UI's current theme.
pub fn palette_of(ui: &Ui) -> Palette {
    if ui.visuals().dark_mode {
        OXIDE
    } else {
        BONE
    }
}

/// A dialog's header row: the title as a display label (left) and a close
/// button (right). Use with `Window::title_bar(false)` and [`dialog_frame`].
/// Returns `true` when the close button was clicked.
pub fn dialog_header(ui: &mut Ui, title: &str) -> bool {
    let p = palette_of(ui);
    let mut close = false;
    ui.horizontal(|ui| {
        ui.label(
            RichText::new(title.to_uppercase())
                .font(FontId::new(size::UI, FontFamily::Name(family::DISPLAY.into())))
                .extra_letter_spacing(size::UI * scale::TRACKING_DISPLAY_EM)
                .color(p.text_strong),
        );
        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
            // Drawn, not a glyph: the system never uses characters as icons.
            let (rect, response) = ui.allocate_exact_size(Vec2::splat(scale::CONTROL_XS), egui::Sense::click());
            let ink = if response.hovered() { p.text_strong } else { p.text_muted };
            if response.hovered() {
                ui.painter().rect_filled(rect, r(scale::RADIUS_SM), p.surface_3);
            }
            let c = rect.center();
            let h = scale::ICON_SM / 2.0 - 3.0;
            let stroke = Stroke::new(2.0, ink);
            ui.painter().line_segment([c + Vec2::new(-h, -h), c + Vec2::new(h, h)], stroke);
            ui.painter().line_segment([c + Vec2::new(h, -h), c + Vec2::new(-h, h)], stroke);
            close = response.on_hover_text("Close").clicked();
        });
    });
    ui.add_space(scale::SPACE_2);
    close
}

/// A selectable row in a list of choices (an Open dialog, a picker): the
/// name on the first line, a muted meta line below, left-aligned, full width.
pub fn choice_row(ui: &mut Ui, title: &str, meta: &str, selected: bool) -> egui::Response {
    let p = palette_of(ui);
    let fill = if selected { p.selected } else { p.surface_1 };
    let stroke = if selected { Stroke::new(1.0, p.accent) } else { Stroke::new(1.0, p.border) };
    let inner = Frame::new()
        .fill(fill)
        .stroke(stroke)
        .corner_radius(r(scale::RADIUS_SM))
        .inner_margin(Margin::symmetric(m(scale::CONTROL_PAD_X), m(scale::SPACE_2 + 2.0)))
        .show(ui, |ui| {
            ui.set_width(ui.available_width());
            ui.spacing_mut().item_spacing.y = 2.0;
            ui.label(text::body(title).color(p.text_strong));
            ui.label(text::small(meta).color(p.text_muted));
        });
    let response = ui.interact(inner.response.rect, inner.response.id.with("choice"), egui::Sense::click());
    if response.hovered() {
        ui.painter().rect_stroke(inner.response.rect, r(scale::RADIUS_SM), Stroke::new(1.0, p.text_muted), egui::StrokeKind::Inside);
    }
    response
}

/// The frame for side and bottom panels: the edition's ground with 16 pt
/// margins (egui's default 8 pt crowds text against the window edge).
pub fn panel_frame(_edition: Edition, fill: Color32) -> Frame {
    // No stroke: egui draws the panel's separator line itself.
    Frame::new()
        .fill(fill)
        .inner_margin(Margin::symmetric(m(scale::SPACE_4), m(scale::SPACE_3)))
}
