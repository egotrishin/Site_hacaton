import { Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AnimatedRoutes } from '@/components/AnimatedRoutes';
import { PageTransition } from '@/components/PageTransition';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import Index from '@/pages/Index';

const Checklist = lazy(() => import('@/pages/Checklist'));
const Competition = lazy(() => import('@/pages/Competition'));
const CompetitionDetails = lazy(() => import('@/pages/CompetitionDetails'));
const Deadlines = lazy(() => import('@/pages/Deadlines'));
const Ege = lazy(() => import('@/pages/Ege'));
const Events = lazy(() => import('@/pages/Events'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const Login = lazy(() => import('@/pages/Login'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Notifications = lazy(() => import('@/pages/Notifications'));
const Olympiads = lazy(() => import('@/pages/Olympiads'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const Pitfalls = lazy(() => import('@/pages/Pitfalls'));
const Profile = lazy(() => import('@/pages/Profile'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Register = lazy(() => import('@/pages/Register'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, gcTime: 300_000, retry: 1, refetchOnWindowFocus: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <div className="app-shell">
              <SiteHeader />
              <Suspense fallback={null}>
                <AnimatedRoutes>
                  <Route path="/" data-genie-title="Главная" data-genie-key="Home" element={<PageTransition transition="fade"><Index /></PageTransition>} />
                  <Route path="/ege" data-genie-title="ЕГЭ" data-genie-key="Ege" element={<PageTransition transition="fade"><Ege /></PageTransition>} />
                  <Route path="/olympiads" data-genie-title="Олимпиады" data-genie-key="Olympiads" element={<PageTransition transition="fade"><Olympiads /></PageTransition>} />
                  <Route path="/competition" data-genie-title="Конкурсные списки (демо)" data-genie-key="Competition" element={<PageTransition transition="fade"><Competition /></PageTransition>} />
                  <Route path="/competition/applicant/:applicantId" data-genie-title="Страница абитуриента (демо)" data-genie-key="CompetitionApplicant" element={<PageTransition transition="fade"><CompetitionDetails /></PageTransition>} />
                  <Route path="/favorites" data-genie-title="Избранное" data-genie-key="Favorites" element={<PageTransition transition="fade"><Favorites /></PageTransition>} />
                  <Route path="/deadlines" data-genie-title="Личные дедлайны" data-genie-key="Deadlines" element={<PageTransition transition="fade"><Deadlines /></PageTransition>} />
                  <Route path="/checklist" data-genie-title="Чек-лист поступления" data-genie-key="Checklist" element={<PageTransition transition="fade"><Checklist /></PageTransition>} />
                  <Route path="/events" data-genie-title="Мероприятия" data-genie-key="Events" element={<PageTransition transition="fade"><Events /></PageTransition>} />
                  <Route path="/onboarding" data-genie-title="Онбординг" data-genie-key="Onboarding" element={<PageTransition transition="fade"><Onboarding /></PageTransition>} />
                  <Route path="/pitfalls" data-genie-title="Подводные камни" data-genie-key="Pitfalls" element={<PageTransition transition="fade"><Pitfalls /></PageTransition>} />
                  <Route path="/register" data-genie-title="Демо-регистрация" data-genie-key="Register" element={<PageTransition transition="fade"><Register /></PageTransition>} />
                  <Route path="/login" data-genie-title="Демо-вход" data-genie-key="Login" element={<PageTransition transition="fade"><Login /></PageTransition>} />
                  <Route path="/profile" data-genie-title="Личный кабинет" data-genie-key="Profile" element={<PageTransition transition="fade"><Profile /></PageTransition>} />
                  <Route path="/notifications" data-genie-title="Уведомления (демо)" data-genie-key="Notifications" element={<PageTransition transition="fade"><Notifications /></PageTransition>} />
                  <Route path="/analytics" data-genie-title="Аналитика (демо)" data-genie-key="Analytics" element={<PageTransition transition="fade"><Analytics /></PageTransition>} />
                  <Route path="*" data-genie-key="NotFound" data-genie-title="Страница не найдена" element={<PageTransition transition="fade"><NotFound /></PageTransition>} />
                </AnimatedRoutes>
              </Suspense>
              <SiteFooter />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
