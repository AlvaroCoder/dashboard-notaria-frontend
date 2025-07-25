import React from "react";
import Title1 from "../elements/Title1";
import { Card, CardContent } from "../ui/card";

function CardFeatures({
    icon, 
    title,
    description
}) {
    return(
        <Card className={'shadow-sm hover:shadow-lg transition-all duration-300'}>
            <CardContent className={'p-6 flex items-start gap-4'}>
                {icon}
                <div>
                    <Title1 className="font-semibold text-lg text-gray-800">{title}</Title1>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
export default React.memo(CardFeatures);