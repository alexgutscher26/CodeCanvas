import { Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import ProPlanView from "./_components/ProPlanView";
import NavigationHeader from "@/components/NavigationHeader";
import { ENTERPRISE_FEATURES, FEATURES } from "./_constants";
import { Star } from "lucide-react";
import FeatureCategory from "./_components/FeatureCategory";
import FeatureItem from "./_components/FeatureItem";
import { Suspense } from "react";
import { ErrorBoundaryClient } from "@/components/ErrorBoundaryClient";
import PricingCTA from "./_components/PricingCTA";

export const metadata: Metadata = {
  title: "Pricing - CodeCanvas Pro",
  description: "Elevate your development experience with CodeCanvas Pro. Access advanced AI features, real-time collaboration, and enterprise-grade tools.",
  openGraph: {
    title: "CodeCanvas Pro - Pricing",
    description: "Unlock the full potential of CodeCanvas with our Pro plan",
    images: ["/og-pricing.png"],
  },
};

function PricingContent() {
  return (
    <div className="text-center mb-24">
      <div className="relative inline-block">
        <div className="absolute -inset-px bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-10" />
        <h1
          className="relative text-5xl md:text-6xl lg:text-7xl font-semibold bg-gradient-to-r
           from-gray-100 to-gray-300 text-transparent bg-clip-text mb-8"
          aria-label="Elevate Your Development Experience"
        >
          Elevate Your <br />
          Development Experience
        </h1>
      </div>
      <p className="text-xl text-gray-400 max-w-3xl mx-auto">
        Join the next generation of developers with our professional suite of tools
      </p>
    </div>
  );
}

function EnterpriseFeatures() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
      {ENTERPRISE_FEATURES.map((feature) => (
        <div
          key={feature.label}
          className="group relative bg-gradient-to-b from-[#12121a] to-[#0a0a0f] rounded-2xl p-6 hover:transform hover:scale-[1.02] transition-all duration-300"
          role="article"
          aria-labelledby={`feature-${feature.label}`}
        >
          <div className="relative">
            <div
              className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 
              flex items-center justify-center mb-4 ring-1 ring-gray-800/60 group-hover:ring-blue-500/20"
              aria-hidden="true"
            >
              <feature.icon className="w-6 h-6 text-blue-400" />
            </div>

            <h3 id={`feature-${feature.label}`} className="text-lg font-medium text-white mb-2">
              {feature.label}
            </h3>
            <p className="text-gray-400">{feature.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

async function PricingPage() {
  const user = await currentUser();
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  
  try {
    const convexUser = user?.id 
      ? await convex.query(api.users.getUser, { userId: user.id })
      : null;

    if (convexUser?.isPro) return <ProPlanView />;

    return (
      <div
        className="relative min-h-screen bg-[#0a0a0f] selection:bg-blue-500/20
        selection:text-blue-200"
      >
        <NavigationHeader />

        <main className="relative pt-32 pb-24 px-4">
          <div className="max-w-7xl mx-auto">
            <ErrorBoundaryClient>
              <Suspense fallback={<div>Loading...</div>}>
                <PricingContent />
                <EnterpriseFeatures />

                {/* Pricing Card */}
                <div className="relative max-w-4xl mx-auto">
                  <div
                    className="absolute -inset-px bg-gradient-to-r from-blue-500
                    to-purple-500 rounded-2xl blur opacity-10"
                  />
                  <div className="relative bg-[#12121a]/90 backdrop-blur-xl rounded-2xl">
                    <div
                      className="absolute inset-x-0 -top-px h-px bg-gradient-to-r 
                      from-transparent via-blue-500/50 to-transparent"
                    />
                    <div 
                      className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r 
                      from-transparent via-purple-500/50 to-transparent" 
                    />

                    <div className="relative p-8 md:p-12">
                      {/* header */}
                      <div className="text-center mb-12">
                        <div 
                          className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/10 
                          to-purple-500/10 ring-1 ring-gray-800/60 mb-6"
                          aria-hidden="true"
                        >
                          <Star className="w-8 h-8 text-blue-400" />
                        </div>
                        <h2 className="text-3xl font-semibold text-white mb-4">
                          Lifetime Pro Access
                        </h2>
                        <div 
                          className="flex items-baseline justify-center gap-2 mb-4"
                          aria-label="Price: 39 dollars one-time payment"
                        >
                          <span className="text-2xl text-gray-400">$</span>
                          <span className="text-6xl font-semibold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
                            39
                          </span>
                          <span className="text-xl text-gray-400">one-time</span>
                        </div>
                        <p className="text-gray-400 text-lg">
                          Unlock the full potential of CodeCanvas
                        </p>
                      </div>

                      {/* Features grid */}
                      <div className="grid md:grid-cols-3 gap-12 mb-12">
                        <FeatureCategory label="Development">
                          {FEATURES.development.map((feature, idx) => (
                            <FeatureItem key={idx}>{feature}</FeatureItem>
                          ))}
                        </FeatureCategory>

                        <FeatureCategory label="Collaboration">
                          {FEATURES.collaboration.map((feature, idx) => (
                            <FeatureItem key={idx}>{feature}</FeatureItem>
                          ))}
                        </FeatureCategory>

                        <FeatureCategory label="Deployment">
                          {FEATURES.deployment.map((feature, idx) => (
                            <FeatureItem key={idx}>{feature}</FeatureItem>
                          ))}
                        </FeatureCategory>
                      </div>

                      {/* CTA */}
                      <PricingCTA />
                    </div>
                  </div>
                </div>
              </Suspense>
            </ErrorBoundaryClient>
          </div>
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Something went wrong. Please try again later.</p>
      </div>
    );
  }
}

export default PricingPage;
