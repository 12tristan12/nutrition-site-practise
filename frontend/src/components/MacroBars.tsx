
interface MacroBarProps{
    label: string;
    amount: number;
    color: string;
    width: number;
}

const MacroBar = ({ label, amount, color, width }: MacroBarProps) => {
  const isActive = amount > 0;

  

  return (
    <div className="macro-bar-contariner">
      <div className="macro-info">
        <span className="macro-label">{label}</span>
        <span className="macro-amount">{amount.toFixed(1)}g</span>
      </div>
      
      <div className="macro-bar-wrapper">
        <div 
          className="macro-bar"
          style={{
            backgroundColor: isActive ? color : '#333',
            width: `${width}%`
          }}
        />
      </div>
    </div>
  );
};

export default MacroBar;