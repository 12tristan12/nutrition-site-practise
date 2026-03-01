import React from "react";

interface ActivityCalculatorProps{
    activitylevel: string;
    intakelevel: string;
    onActivityChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onIntakeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ActivityCalculator = ({activitylevel, intakelevel, onActivityChange, onIntakeChange}: ActivityCalculatorProps) => {
    return(
        <div className="activity-calc-container">
            <h3>Activity</h3>
            <div className="activity-calc">
                    <select value={activitylevel} onChange={onActivityChange}>
                        <option value="light">Excercise 1-3 / week</option>
                        <option value="moderate">Excercise 4-5 / week</option>
                        <option value="active">Daily excercise or intense 3 - 4 /week</option>
                        <option value="very-active">Intense excercise 6 - 7 / week</option>
                        <option value="athlete">Very intense excercise daily</option>    
                    </select>
            </div>
            <h3>Intake</h3>
            <div className="activity-calc">
                    <select value={intakelevel} onChange={onIntakeChange}>
                        <option value="loss-big">Weight loss 1kg / week</option>
                        <option value="loss">Weight loss 0.5kg / week</option>
                        <option value="loss-small">Weight loss 0.25kg / week</option>
                        <option value="maintain">Maintain weight</option>
                        <option value="gain-small">Weight gain 0.25kg / week</option>
                        <option value="gain">Weight gain 0.5kg / week</option>
                        <option value="gain-big">Weight gain 1kg / week</option>    
                    </select>
            </div>
        </div>
    );
};


export default ActivityCalculator;