"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Image from "next/image";

// Particles Background Component
const ParticlesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Particle[] = [];
    const particleCount = 80;
    const connectionDistance = 150;

    const isDark = theme === "dark";
    const particleColor = isDark
      ? "rgba(39, 174, 96, 0.6)"
      : "rgba(30, 132, 73, 0.5)";
    const connectionColor = isDark
      ? "rgba(39, 174, 96,"
      : "rgba(30, 132, 73,";

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
      }

      update(canvas: HTMLCanvasElement) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(canvas));
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, i) => {
        particle.update(canvas);
        particle.draw(ctx);

        particles.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `${connectionColor}${
              0.2 * (1 - distance / connectionDistance)
            })`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [mounted, theme]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: "transparent" }}
    />
  );
};

const ticks = [
  { sym: "AAPL",  val: "$214.38", change: "2.74%", up: true  },
  { sym: "NVDA",  val: "$138.85", change: "3.18%", up: true  },
  { sym: "MSFT",  val: "$421.10", change: "1.42%", up: true  },
  { sym: "TSLA",  val: "$175.22", change: "0.87%", up: false },
  { sym: "AMZN",  val: "$192.45", change: "0.74%", up: true  },
  { sym: "GOOGL", val: "$175.80", change: "0.52%", up: true  },
  { sym: "META",  val: "$512.30", change: "1.10%", up: true  },
  { sym: "NFLX",  val: "$638.94", change: "0.43%", up: false },
  { sym: "AMD",   val: "$162.75", change: "2.05%", up: true  },
  { sym: "JPM",   val: "$224.60", change: "0.31%", up: false },
];

const TickerTape = () => (
  <div className="ticker-tape relative z-10 py-2.5">
    <div className="ticker-inner">
      {[...ticks, ...ticks].map((tick, i) => (
        <React.Fragment key={i}>
          <span className="inline-flex items-center gap-1.5 text-[0.72rem] font-mono">
            <span className="font-semibold text-[#a9dfbf]">{tick.sym}</span>
            <span className="text-white/70">{tick.val}</span>
            <span className={tick.up ? "text-[#27ae60]" : "text-[#e74c3c]"}>
              {tick.up ? "▲" : "▼"}{tick.change}
            </span>
          </span>
          <span className="text-[rgba(39,174,96,0.25)]">|</span>
        </React.Fragment>
      ))}
    </div>
  </div>
);

const HeroSection = () => {
  const integrationGroups = [
    ["TradeStation", "Tastytrade", "Ally Invest"],
    ["E-Trade", "WEBULL", "Think or Swim", "Schwab"],
    ["TD Ameritrade", "Interactive Brokers"],
  ];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [animating, setAnimating] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % integrationGroups.length);
        setAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, [integrationGroups.length]);

  return (
    <section className="relative overflow-hidden lg:min-h-[calc(100vh-80px)]">
      <ParticlesBackground />

      {/* Radial gradient glow behind hero */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-green-500/7 dark:bg-green-500/12 rounded-full blur-[120px] pointer-events-none" />

      {/* Ticker Tape */}
      <TickerTape />

      <div
        className={`relative z-10 mx-auto max-w-7xl pt-8 px-4 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Integration Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/60 dark:bg-white/[0.06] backdrop-blur-md border border-gray-200/60 dark:border-white/[0.08] px-3 sm:px-4 py-1.5 sm:py-2 text-[9px] sm:text-[10px] md:text-xs font-medium shadow-sm">
            <span className="flex h-1.5 w-1.5 shrink-0 rounded-full bg-green-500 animate-pulse" />
            <span className="text-gray-500 dark:text-gray-400 whitespace-nowrap">
              Integrates with
            </span>
            <span
              className={`flex items-center gap-1 sm:gap-1.5 transition-all duration-400 ${
                animating
                  ? "opacity-0 translate-y-2"
                  : "opacity-100 translate-y-0"
              }`}
            >
              {integrationGroups[activeIndex].map(
                (platform: string, index: number) => (
                  <React.Fragment key={platform}>
                    <span className="font-semibold text-gray-800 dark:text-white whitespace-nowrap">
                      {platform}
                    </span>
                    {index < integrationGroups[activeIndex].length - 1 && (
                      <span className="text-gray-300 dark:text-gray-600">
                        /
                      </span>
                    )}
                  </React.Fragment>
                ),
              )}
            </span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="mx-auto mt-6 max-w-4xl text-center lg:mt-12">
          <h1 className="text-[1.5rem] sm:text-[2.25rem] lg:text-[3.1rem] font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white lg:leading-[1.08]">
            Copy Futures, Options & Contracts
            <br />
            <span className="bg-gradient-to-r from-green-700 via-green-500 to-emerald-400 bg-clip-text text-transparent">
              with Precision
            </span>
          </h1>

          <p className="text-[13px] sm:text-base lg:text-lg mx-auto mt-4 max-w-2xl leading-relaxed text-gray-500 dark:text-gray-400 lg:mt-6">
            Mirror real-time stock and options trades from top-performing
            traders. Precision, flexibility, and transparency—straight to your
            fingertips.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:mt-10">
          <Link
            href="/register"
            className="group w-full sm:w-auto relative overflow-hidden rounded-full bg-[var(--primary)] px-8 py-3 text-center text-sm font-semibold text-white transition-all hover:bg-[var(--primary-hover)] hover:shadow-xl hover:shadow-green-500/25 hover:-translate-y-0.5 sm:px-10 sm:py-3.5"
          >
            <span className="relative z-10">Start Copying Now</span>
            <span className="absolute inset-0 bg-gradient-to-r from-green-700 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto rounded-full border border-gray-300 dark:border-white/20 bg-white/50 dark:bg-white/[0.04] backdrop-blur-sm px-8 py-3 text-center text-sm font-semibold text-gray-700 dark:text-gray-200 transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] dark:hover:border-[var(--primary)] dark:hover:text-[var(--primary)] hover:-translate-y-0.5 sm:px-10 sm:py-3.5"
          >
            View Expert Traders
          </Link>
        </div>

        {/* Network Illustration */}
        <div className="relative mx-auto mt-8 w-full max-w-xl lg:mt-14">
          <HeroMainImage />
        </div>
      </div>
    </section>
  );
};

// Stat Item Component
const StatItem = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center">
    <div className="text-3xl font-bold text-foreground lg:text-4xl">
      {value}
    </div>
    <div className="mt-1 text-sm text-[var(--foreground-muted)] lg:text-base">
      {label}
    </div>
  </div>
);

// Network Illustration Component
const HeroMainImage = () => {
  return (
    <div className="relative">
      {/* Hero Main Image -- Cluade, Leave this I will be adding an image here */}
      <div className="max-w-2xl">
        <Image
          src="/images/banner_image.png"
          alt="Network Illustration"
          width={1536}
          height={1024}
          className="rounded-2xl object-contain hidden dark:block"
        />
        <Image
          src="/images/banner_image.png"
          alt="Network Illustration"
          width={1536}
          height={1024}
          className="rounded-2xl object-contain block dark:hidden"
        />
      </div>
    </div>
  );
};

// Avatar Node Component
interface AvatarNodeProps {
  size: number;
  primary?: boolean;
  gender?: string;
  hasBeard?: boolean;
  hasGlasses?: boolean;
  hairColor?: string;
  skinTone?: string;
  bald?: boolean;
}

const AvatarNode = ({
  size,
  primary,
  gender = "male",
  hasBeard,
  hasGlasses,
  hairColor = "brown",
  skinTone = "light",
  bald,
}: AvatarNodeProps) => {
  const skinColors: Record<string, string> = {
    light: "#F5D0C5",
    medium: "#D4A574",
    dark: "#8B6914",
  };
  const hairColors: Record<string, string> = {
    brown: "#4A3728",
    dark: "#1a1a1a",
    blonde: "#C9A227",
    red: "#8B3A3A",
    gray: "#808080",
  };

  const skin = skinColors[skinTone] || skinColors.light;
  const hair = bald ? skin : hairColors[hairColor] || hairColors.brown;
  const showGlasses = primary || hasGlasses;

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[var(--surface)] shadow-sm ${
        primary
          ? "ring-4 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--background)]"
          : "border-2 border-[var(--border)] dark:border-[rgba(39,174,96,0.3)]"
      }`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.7}
        height={size * 0.7}
        viewBox="0 0 40 40"
        fill="none"
      >
        <circle cx="20" cy="18" r="10" fill={skin} />
        {!bald && gender === "male" && (
          <path
            d="M10 14 Q10 8, 20 8 Q30 8, 30 14 Q30 10, 20 10 Q10 10, 10 14"
            fill={hair}
          />
        )}
        {!bald && gender === "female" && (
          <>
            <ellipse cx="20" cy="10" rx="10" ry="5" fill={hair} />
            <ellipse cx="12" cy="16" rx="3" ry="8" fill={hair} />
            <ellipse cx="28" cy="16" rx="3" ry="8" fill={hair} />
          </>
        )}
        <circle cx="16" cy="17" r="1.5" fill="#1a1a1a" />
        <circle cx="24" cy="17" r="1.5" fill="#1a1a1a" />
        {showGlasses && (
          <>
            <circle
              cx="16"
              cy="17"
              r="4"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="1"
            />
            <circle
              cx="24"
              cy="17"
              r="4"
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="1"
            />
            <line
              x1="20"
              y1="17"
              x2="20"
              y2="17"
              stroke="#1a1a1a"
              strokeWidth="1"
            />
          </>
        )}
        {hasBeard && gender === "male" && (
          <ellipse cx="20" cy="24" rx="6" ry="4" fill={hair} opacity="0.7" />
        )}
        <path
          d="M8 38 Q8 30, 20 28 Q32 30, 32 38"
          fill={primary ? "#27ae60" : "#145a32"}
        />
      </svg>
    </div>
  );
};

const GlobeIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

export default HeroSection;
