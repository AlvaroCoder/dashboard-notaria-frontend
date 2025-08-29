"use client";

import { fetchImageEvidence } from '@/lib/apiConnectionsEvidences';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import Title1 from '../elements/Title1';
import Separator2 from '../elements/Separator2';

export default function CardShowVehicleData({ cardData = "" }) {
    const [loading, setLoading] = useState(true);
    const [imageCarData, setImageCarData] = useState(null);

    useEffect(() => {
        let isMounted = true;
        async function fetchDataCarData() {
            try {
                setLoading(true);
                const responseImageCarData = await fetchImageEvidence(cardData);
                const blob = await responseImageCarData.blob();
                const urlImageCarData = URL.createObjectURL(blob);

                if (isMounted) setImageCarData(urlImageCarData);
            } catch (err) {
                console.error("Error cargando imagen:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }
        fetchDataCarData();
        return () => {
            isMounted = false;
            if (imageCarData) URL.revokeObjectURL(imageCarData);
        };
    }, [cardData]);

    return (
        <section className="w-full p-6 bg-slate-100 h-full">
            <div className="p-4 shadow bg-white rounded-lg">
                <Title1 className="text-lg w-full text-center">Información del Vehículo del Cliente</Title1>
                <Separator2 />

                {loading ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <Loader2 className="animate-spin w-10 h-10 text-slate-500 mb-2" />
                        <p className="text-slate-500 text-sm">Cargando imagen...</p>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center"
                    >
                        <Image
                            src={imageCarData}
                            alt="Imagen del vehículo"
                            width={500}
                            height={800}
                            className="rounded-xl shadow-lg object-cover h-[500px] w-auto"
                        />
                    </motion.div>
                )}
            </div>
        </section>
    );
}