import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface PlatformCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  content: string;
  buttonText: string;
  buttonVariant?: 'default' | 'outline' | 'destructive' | 'secondary' | 'ghost' | 'link';
  onButtonClick?: () => void;
}

export const PlatformCard = ({
  icon: Icon,
  title,
  description,
  content,
  buttonText,
  buttonVariant = 'outline',
  onButtonClick,
}: PlatformCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{content}</p>
        <Button variant={buttonVariant} className="w-full" onClick={onButtonClick}>
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};
