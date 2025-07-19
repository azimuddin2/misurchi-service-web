'use client';

import backgroundImg from '@/assets/images/background-img.png';
import Container from '@/components/shared/Container';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "@/components/ui/accordion";
import { PlusCircle } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

const items = [
    {
        title: "How do I pay for my services?",
        content: "You can pay using debit or credit cards, mobile wallets, or through our secure online checkout during the booking process.",
    },
    {
        title: "Are the service providers trained and supervised?",
        content:
            "Yes, every service provider receives comprehensive training and is closely supervised by experienced team leaders to ensure consistent, high-quality performance tailored to your needs.",
    },
    {
        title: "How do I book a service?",
        content:
            "Browse our services, select the one you need, and complete the guided booking process directly on our platform.",
    },
    {
        title: "Can I cancel or reschedule a service?",
        content:
            "Yes, you can cancel or reschedule appointments up to 24 hours in advance through your dashboard, without any hassle.",
    },
];

const FAQSection = () => {
    return (
        <div
            className="py-10 px-4 md:py-20 md:px-8"
            style={{
                backgroundImage: `url(${backgroundImg.src})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <Container>
                <h1 className="text-center text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 text-[#141414]">
                    Frequently Asked Questions
                </h1>

                <Accordion
                    defaultValue="item-0"
                    type="single"
                    collapsible
                    className="space-y-4"
                >
                    {items.map(({ title, content }, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="bg-white/90 backdrop-blur-md py-1 px-4 rounded-md"
                        >
                            <AccordionPrimitive.Header className="flex">
                                <AccordionPrimitive.Trigger className="flex flex-1 items-center text-base md:text-xl lg:text-2xl text-gray-950 justify-between py-4 font-medium transition-all hover:text-gray-800 [&[data-state=open]>svg]:rotate-45">
                                    {title}
                                    <PlusCircle className="h-6 w-6 md:h-7 md:w-7 lg:h-8 lg:w-8 shrink-0 text-gray-800 transition-transform duration-200" />
                                </AccordionPrimitive.Trigger>
                            </AccordionPrimitive.Header>
                            <AccordionContent className="text-sm md:text-base lg:text-lg text-gray-600">
                                {content}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </Container>
        </div>
    );
};

export default FAQSection;
