import consumedFoods from "../pages/MainPage";

interface MacroBarProps{
    label: string;
    amount: number;
    color: string;
}

const MacroBar = ({ label, amount, color }: MacroBarProps) => {
  const isActive = amount > 0;

  return (
    <div className="macro-bar-container">
      <div className="macro-info">
        <span className="macro-label">{label}</span>
        <span className="macro-amount">{amount.toFixed(1)}g</span>
      </div>
      
      <div className="macro-bar-wrapper">
        <div 
          className="macro-bar"
          style={{
            backgroundColor: isActive ? color : '#333',
            width: '100%'
          }}
        />
      </div>
    </div>
  );
};

export default MacroBar;