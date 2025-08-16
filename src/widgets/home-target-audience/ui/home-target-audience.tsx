import { GraduationCap, BookOpen, Sparkles } from 'lucide-react';

export const HomeTargetAudience = () => {
  return (
    <section
      id="about"
      className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Для кого создан Zein
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Наша платформа помогает образовательным учреждениям любого уровня
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Педагоги начального образования
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Создавайте увлекательные уроки, интерактивные презентации и авторские материалы для
              учеников. ИИ адаптирует контент под возраст и уровень подготовки.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Преподаватели среднего образования
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Разрабатывайте профессиональные методички, практические работы и теоретические курсы
              для подготовки специалистов.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Преподаватели высшего образования
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Создавайте научно-методические материалы, лекционные курсы и исследовательские проекты
              для студентов и аспирантов с помощью ИИ.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
