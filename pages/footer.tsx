const Footer = () => {
  return (
    <footer className="bg-neutral-100 border-t border-gray-300 text-sm text-neutral-dark py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left text-gray-600">
          © {new Date().getFullYear()} Chain Repair. All rights reserved.
        </div>
        <div className="flex gap-4 text-blue-500">
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
          <a href="/contact" className="hover:underline">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
