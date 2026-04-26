const AboutSection = () => {
  return (
    <section
      id="about"
      className="py-20 bg-background transition-colors border-t border-border/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Honoring Brahmin Heritage
            </h2>
            <div className="h-1 w-16 rounded-full bg-primary mb-6" />
            <p className="text-lg text-muted-foreground mb-6">
              VipraPariwar is an exclusive, invite-only platform dedicated to
              the Brahmin community. We maintain the highest standards of
              authenticity and tradition by carefully vetting each family
              before extending an invitation to join our sacred matrimonial
              community.
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              Our invitation-only approach ensures that every member shares our
              commitment to preserving Brahmin heritage, gotra traditions, and
              the spiritual values that define our community. This exclusivity
              creates a trusted environment for meaningful connections.
            </p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Invite-only exclusive access
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Verified Brahmin families only
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Gotra and sub-caste compatibility
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                Curated, trusted community
              </li>
            </ul>
          </div>
          <div className="rounded-lg p-8 text-center border border-border bg-card/80 backdrop-blur-sm">
            <div className="text-6xl mb-4">🕉️</div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Sacred Traditions
            </h3>
            <p className="text-muted-foreground">
              “Marriage is not just the union of two individuals, but the coming
              together of two families, two lineages, and two spiritual paths.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default AboutSection;