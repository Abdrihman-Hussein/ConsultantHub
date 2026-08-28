export default function Footer() {
  return (
    <footer className="bg-primary-container full-width border-t border-outline-variant mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center py-12 px-8 max-w-max-width mx-auto gap-6 md:gap-0">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-headline-md text-headline-md text-on-primary-container mb-2">
            ConsultantHub
          </span>
          <span className="font-body-md text-body-md text-on-primary-container/80 text-center md:text-left">
            © 2024 ConsultantHub. All professional rights reserved.
          </span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          <a className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-on-primary-container hover:opacity-100 transition-opacity" href="#">Terms of Service</a>
          <a className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-on-primary-container hover:opacity-100 transition-opacity" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-on-primary-container hover:opacity-100 transition-opacity" href="#">Contact Support</a>
          <a className="font-label-sm text-label-sm text-on-primary-container/80 hover:text-on-primary-container hover:opacity-100 transition-opacity" href="#">Become a Consultant</a>
        </nav>
      </div>
    </footer>
  );
}