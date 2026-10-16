use ironmaw_egui::{fonts, style, Edition, BONE, OXIDE};

#[test]
fn palettes_come_from_the_tokens() {
    assert_eq!(OXIDE.bg, egui::Color32::from_rgb(0x0F, 0x14, 0x16));
    assert_eq!(BONE.bg, egui::Color32::from_rgb(0xED, 0xE6, 0xD8));
    assert_eq!(ironmaw_egui::brand::RUST, egui::Color32::from_rgb(0xD0, 0x60, 0x2B));
}

#[test]
fn style_is_roomier_than_egui_defaults() {
    let ours = style(Edition::Oxide);
    let stock = egui::Style::default();
    assert!(ours.spacing.extra_text_line_spacing > stock.spacing.extra_text_line_spacing);
    assert!(ours.spacing.button_padding.x >= 12.0);
    assert!(ours.spacing.interact_size.y >= 36.0);
    assert!(ours.visuals.dark_mode);
    assert!(!style(Edition::Bone).visuals.dark_mode);
}

#[test]
fn fonts_register_every_family() {
    let defs = fonts();
    for fam in [ironmaw_egui::family::MEDIUM, ironmaw_egui::family::STRONG, ironmaw_egui::family::DISPLAY, ironmaw_egui::family::DISPLAY_BOLD] {
        assert!(defs.families.contains_key(&egui::FontFamily::Name(fam.into())), "{fam}");
    }
    assert_eq!(defs.families[&egui::FontFamily::Proportional][0], "inter-regular");
}
