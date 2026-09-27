import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/Button';

export function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface-50 text-center p-8" dir="rtl">
      <p className="text-6xl mb-4">🔒</p>
      <h1 className="text-2xl font-bold text-surface-900">غير مصرح بالدخول</h1>
      <p className="text-surface-500 mt-2 mb-8">ليس لديك صلاحية للوصول إلى هذه الصفحة.</p>
      <Link to="/"><Button size="lg">العودة للرئيسية</Button></Link>
    </div>
  );
}
