import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Facebook,
  Youtube,
  Instagram,
  Send,
  CheckCircle2,
} from "lucide-react";
import { ContactInfo, mockContactInfo } from "../data/teachersAndContactData";
import { useLanguage } from "../context/LanguageContext";

interface ContactSectionProps {
  contactInfo?: ContactInfo;
  title?: string;
  subtitle?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactInfo = mockContactInfo,
  title,
  subtitle,
}) => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "",
    message: "",
  });

  const displayTitle = title || t("contactHeading");
  const displaySubtitle = subtitle || t("contactSubtitle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", phone: "", subject: "", message: "" });
    }, 4000);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "whatsapp":
        return <MessageCircle className="w-5 h-5 text-emerald-500" />;
      default:
        return <MessageCircle className="w-5 h-5" />;
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-r from-primary/5 via-emerald-500/5 to-amber-500/5 pointer-events-none blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 md:mb-16">
          <div
            className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs md:text-sm font-bold px-4 py-2 rounded-full mb-4 shadow-xs border border-emerald-200 dark:border-emerald-800/50"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t("contactBadge")}</span>
          </div>

          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-5 leading-tight"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            {displayTitle}
          </h2>

          <p
            className="text-base sm:text-lg text-muted-foreground leading-relaxed"
            style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
          >
            {displaySubtitle}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <a
              href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`}
              className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group block cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4
                  className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {t("phoneLabel")}
                </h4>
                <p
                  className="text-lg font-bold text-foreground group-hover:text-primary transition-colors"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {contactInfo.phone}
                </p>
              </div>
            </a>

            <a
              href={`mailto:${contactInfo.email}`}
              className="bg-card border border-border rounded-2xl p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group block cursor-pointer"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h4
                  className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {t("emailLabel")}
                </h4>
                <p
                  className="text-lg font-bold text-foreground group-hover:text-emerald-600 transition-colors"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {contactInfo.email}
                </p>
              </div>
            </a>

            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4
                    className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {t("addressLabel")}
                  </h4>
                  <p
                    className="text-base font-bold text-foreground"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {contactInfo.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-3 border-t border-border/60">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4
                    className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wider"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {t("hoursLabel")}
                  </h4>
                  <p
                    className="text-sm font-bold text-foreground"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {contactInfo.officeHours}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h4
                className="text-xs font-semibold text-muted-foreground mb-4 uppercase tracking-wider"
                style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
              >
                {t("socialLabel")}
              </h4>
              <div className="flex items-center gap-3 flex-wrap">
                {contactInfo.socialLinks.map((social) => (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted hover:bg-primary hover:text-white transition-all text-xs font-bold border border-border/50 cursor-pointer"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {getSocialIcon(social.platform)}
                    <span>{social.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form (7 Cols) */}
          <div className="lg:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-10 shadow-lg relative">
            <h3
              className="text-2xl font-bold text-foreground mb-2"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              {t("sendMessage")}
            </h3>
            <p
              className="text-sm text-muted-foreground mb-6"
              style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
            >
              {t("sendSubtitle")}
            </p>

            {submitted ? (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center space-y-3 animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4
                  className="text-xl font-bold text-emerald-800 dark:text-emerald-200"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {t("thankYouMessage")}
                </h4>
                <p
                  className="text-sm text-emerald-600 dark:text-emerald-400"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                >
                  {t("thankYouSubtitle")}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-xs font-bold text-foreground mb-2"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      {t("nameLabel")}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t("namePlaceholder")}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-xs font-bold text-foreground mb-2"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    >
                      {t("phoneInputLabel")}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="01700-000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-xs font-bold text-foreground mb-2"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {t("subjectLabel")}
                  </label>
                  <input
                    type="text"
                    placeholder={t("subjectPlaceholder")}
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-bold text-foreground mb-2"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  >
                    {t("messageLabel")}
                  </label>
                  <textarea
                    rows={4}
                    placeholder={t("messagePlaceholder")}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  />
                </div>

                <button
                  type="submit"
                  style={{ fontFamily: "'Hind Siliguri', sans-serif" }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white font-bold py-3.5 px-6 rounded-xl hover:bg-green-600 transition-all shadow-md cursor-pointer text-sm"
                >
                  <Send className="w-4 h-4" />
                  {t("submitButton")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
