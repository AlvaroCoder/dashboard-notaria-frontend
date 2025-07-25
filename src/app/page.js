'use client';
import CardFeatures from "@/components/Cards/CardFeatures";
import Title1 from "@/components/elements/Title1";
import { features } from "@/data/Features";

export default function Home() {
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <Title1 className="text-3xl">Bienvenido al Sistema Notarial</Title1>
      <p className="text-gray-600 mb-8">
        Gestiona fácilmente todos los procesos de tu notaría desde un solo lugar.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <CardFeatures key={index} {...feature}/>
        ))}
      </div>
      <div>
        
      </div>
    </main>
  );
}
