import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  imageSrc: string;
  lsTitle: ReactNode;
  lsSubtitle: string;
}
export default function AuthLayout  ({children, title, subtitle, imageSrc, lsTitle, lsSubtitle }: AuthLayoutProps)  {
  return (
    <div className="flex h-screen-auto w-full mx-auto my-5 overflow-hidden">
      {/* Left Section - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden slide-left">
        <div className="absolute inset-0 z-0">
          <img
            src={imageSrc}
            alt="Cinematic background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/20 via-transparent to-background-dark z-10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent z-10"></div>
          <div className="absolute inset-0 bg-black/40 z-0"></div>
        </div>

        <div className="relative z-20 flex flex-col justify-center left-1/4 p-22 w-full">
          <h1 className="text-7xl font-black text-white leading-tight tracking-tighter uppercase mb-6">
            {lsTitle}
          </h1>
          
          <p className="text-xl text-white/70 max-w-lg font-medium leading-relaxed">
            {lsSubtitle}
          </p>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img
                src="https://picsum.photos/seed/user1/100/100"
                alt="User 1"
                className="w-10 h-10 rounded-full border-2 border-background-dark object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="w-10 h-10 rounded-full border-2 border-background-dark bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                +2M
              </div>
            </div>
            <p className="text-sm text-white/50 font-medium">Joined by movie enthusiasts worldwide</p>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full  lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-24 bg-background-dark relative slide-right">
        <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-primary/5 blur-[120px] rounded-full"></div>
        
        <div className="w-full max-w-md relative z-10 auth-card-anim">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">{title}</h2>
            <p className="text-white/50">{subtitle}</p>
          </div>
            {children}
        </div>
      </div>
    </div>
  )
}
