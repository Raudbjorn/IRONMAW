//! Visual check for the theme: the CV workspace's tightest spots (sidebar
//! fields, a long text area, the paper page, a dialog, the status bar).
//!
//!   cargo run --example gallery              # IRONMAW
//!   IRONMAW_STOCK=1 cargo run --example gallery   # stock egui, for comparison
//!   IRONMAW_EDITION=bone cargo run --example gallery
//!
//! People and text are fictional (the synthetic Alex Example fixture).

use eframe::egui::{self, Align, Layout, RichText, Vec2};
use ironmaw_egui::{self as iron, scale, text, Edition};

struct Gallery {
    stock: bool,
    edition: Edition,
    name: String,
    headline: String,
    email: String,
    body: String,
    dialog: bool,
}

impl Gallery {
    fn new(cc: &eframe::CreationContext<'_>) -> Self {
        let stock = std::env::var_os("IRONMAW_STOCK").is_some();
        let edition = match std::env::var("IRONMAW_EDITION").as_deref() {
            Ok("bone") => Edition::Bone,
            _ => Edition::Oxide,
        };
        if !stock {
            iron::install(&cc.egui_ctx, edition);
        }
        Self {
            stock,
            edition,
            name: "Alex Example".into(),
            headline: "Senior backend & platform engineer".into(),
            email: "alex@example.test".into(),
            body: "Over a decade building payment and logistics systems for regulated markets, and now a multi-tenant SaaS platform on managed cloud infrastructure. I design for failures you can see and code the next engineer can change.".into(),
            dialog: std::env::var_os("IRONMAW_DIALOG").is_some(),
        }
    }

    fn field(&self, ui: &mut egui::Ui, label: &str, value: &mut String, multiline: bool) {
        if self.stock {
            ui.label(label);
            if multiline {
                ui.text_edit_multiline(value);
            } else {
                ui.text_edit_singleline(value);
            }
        } else {
            iron::field(ui, label, |ui| {
                let w = ui.available_width();
                if multiline {
                    ui.add_sized([w, 0.0], iron::text_area(value))
                } else {
                    ui.add_sized([w, 0.0], iron::text_field(value))
                }
            });
        }
    }
}

impl eframe::App for Gallery {
    fn ui(&mut self, ui: &mut egui::Ui, _frame: &mut eframe::Frame) {
        let ctx = ui.ctx().clone();
        let p = self.edition.palette();
        egui::Panel::bottom("status").frame(if self.stock { egui::Frame::side_top_panel(ui.style()) } else { iron::panel_frame(self.edition, p.bg) }).show(ui, |ui| {
            ui.add_space(8.0);
            ui.horizontal(|ui| {
                if self.stock {
                    ui.label("LOCAL WORKSPACE  Saved draft");
                } else {
                    ui.label(text::label("Local workspace").color(p.text_faint));
                    ui.add_space(scale::SPACE_3);
                    ui.label(text::small("Saved draft").color(p.text));
                }
            });
            ui.add_space(8.0);
        });

        egui::Panel::left("tools").exact_size(scale::SIDEBAR).frame(if self.stock { egui::Frame::side_top_panel(ui.style()) } else { iron::panel_frame(self.edition, p.surface_1) }).show(ui, |ui| {
            ui.add_space(16.0);
            if self.stock {
                ui.heading("HEADER");
                ui.label("These fields are read-only until you choose Edit.");
            } else {
                ui.label(text::label("Header").color(p.text_strong));
                ui.add_space(scale::SPACE_1);
                ui.label(text::small("These fields are read-only until you choose Edit.").color(p.text_muted));
                ui.add_space(scale::FIELD_GAP - ui.spacing().item_spacing.y);
            }
            let mut name = std::mem::take(&mut self.name);
            self.field(ui, "Full name", &mut name, false);
            self.name = name;
            let mut headline = std::mem::take(&mut self.headline);
            self.field(ui, "Headline", &mut headline, false);
            self.headline = headline;
            let mut email = std::mem::take(&mut self.email);
            self.field(ui, "Email", &mut email, false);
            self.email = email;
            let mut body = std::mem::take(&mut self.body);
            self.field(ui, "Text", &mut body, true);
            if self.stock {
                ui.label(format!("{} of 1000 characters in this passage", body.chars().count()));
            } else {
                ui.label(text::mono(format!("{} of 1000 characters", body.chars().count())).color(p.text_faint));
            }
            self.body = body;
            ui.add_space(16.0);
            ui.horizontal(|ui| {
                if self.stock {
                    let _ = ui.button("Review fact");
                    let _ = ui.button("Edit");
                } else {
                    let _ = ui.add(iron::secondary_button("Review fact"));
                    let _ = ui.add(iron::primary_button("Save & lock", self.edition));
                }
            });
        });

        egui::CentralPanel::default().show(ui, |ui| {
            ui.add_space(24.0);
            ui.with_layout(Layout::top_down(Align::Center), |ui| {
                let page_w = 560.0;
                let frame = if self.stock { egui::Frame::new().fill(egui::Color32::from_rgb(242, 238, 230)).inner_margin(40) } else { iron::paper_frame() };
                frame.show(ui, |ui| {
                    ui.set_width(page_w);
                    ui.with_layout(Layout::top_down(Align::Min), |ui| {
                        let ink = ironmaw_egui::BONE;
                        if self.stock {
                            ui.label(RichText::new(&self.name).size(28.0).color(ink.text_strong));
                            ui.label(RichText::new(&self.headline).color(ink.text));
                            ui.label(RichText::new(&self.email).color(ink.text_muted));
                            ui.label(RichText::new(&self.body).color(ink.text));
                            ui.label(RichText::new("EXPERIENCE").color(ink.text_strong));
                            ui.label(RichText::new("Built durable processing from a queue through a broker worker using service bindings and object coordination. Bounded execution, retries and dead-letter handling make failures visible.").color(ink.text));
                        } else {
                            ui.label(text::title(&self.name).size(ironmaw_egui::size::HEADLINE).color(ink.text_strong));
                            ui.label(text::body(&self.headline).color(ink.text));
                            ui.label(text::small(format!("{}  ·  +354 555 0100  ·  Reykjavík", self.email)).color(ink.text_muted));
                            ui.add_space(scale::PARAGRAPH_GAP);
                            ui.label(text::body(&self.body).color(ink.text));
                            ui.add_space(scale::SPACE_6);
                            ui.label(text::label("Experience").color(ink.text_strong));
                            ui.add_space(scale::SPACE_2);
                            ui.label(text::mono("2019 – 2025").color(ink.text_muted));
                            ui.label(text::body("Backend Engineer · Sample Systems").strong().color(ink.text_strong));
                            ui.label(text::body("Built durable processing from a queue through a broker worker using service bindings and object coordination. Bounded execution, retries and dead-letter handling make failures visible.").color(ink.text));
                        }
                    });
                });
            });
        });

        if self.dialog {
            let mut open = true;
            let mut window = egui::Window::new("Open a CV")
                .collapsible(false)
                .resizable(false)
                .anchor(egui::Align2::CENTER_CENTER, Vec2::ZERO)
                .open(&mut open);
            if !self.stock {
                window = window.title_bar(false).frame(iron::dialog_frame(self.edition));
            }
            window.show(&ctx, |ui| {
                ui.set_width(420.0);
                if self.stock {
                    ui.label("Choose a main CV, or the CV adapted for an application. Your original stays separate.");
                    let _ = ui.button("Alex Example — English · saved revision 1");
                    let _ = ui.button("Close");
                } else {
                    let _ = iron::dialog_header(ui, "Open a CV");
                    ui.label(text::body("Choose a main CV, or the CV adapted for an application. Your original stays separate.").color(p.text_muted));
                    ui.add_space(scale::SPACE_4);
                    ui.label(text::label("Main CVs").color(p.text_muted));
                    let _ = iron::choice_row(ui, "Alex Example", "English · saved revision 1", true);
                    ui.add_space(scale::SPACE_2);
                    ui.label(text::label("Applications").color(p.text_muted));
                    let _ = iron::choice_row(ui, "Northstar Systems · Platform Engineer", "No CV yet · adapt your main CV", false);
                    ui.add_space(scale::SPACE_4);
                    ui.with_layout(Layout::right_to_left(Align::Min), |ui| {
                        let _ = ui.add(iron::secondary_button("Close"));
                    });
                }
            });
        }
    }
}

fn main() -> eframe::Result {
    let options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default().with_inner_size([1360.0, 860.0]),
        ..Default::default()
    };
    eframe::run_native("IRONMAW egui gallery", options, Box::new(|cc| Ok(Box::new(Gallery::new(cc)))))
}
