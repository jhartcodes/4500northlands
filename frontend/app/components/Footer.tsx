type FooterProps = {
  privacyPolicyUrl?: string
}

export default function Footer({privacyPolicyUrl}: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-navy py-6">
      <div className="container">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-white/70">
          <p>© {currentYear} Beedie</p>
          {privacyPolicyUrl && (
            <a
              href={privacyPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Privacy Policy
            </a>
          )}
        </div>
      </div>
    </footer>
  )
}
