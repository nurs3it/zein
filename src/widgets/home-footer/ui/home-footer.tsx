import Image from 'next/image';

export const HomeFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Image src="/dark-logo.svg" alt="Zein" width={32} height={32} />
            <span className="font-bold text-xl">Zein</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">Социальные сети</span>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Zein. Автоматизация образования с помощью искусственного интеллекта.</p>
        </div>
      </div>
    </footer>
  );
};
