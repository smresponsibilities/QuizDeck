export default function Card({ children }) {
  return (
    <div
      className="bg-zinc-500 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-30 backdrop-saturate-100 backdrop-contrast-100 
      shadow-[8px_4px_252px_19px_rgba(96,_18,_159,_0.55)]
      max-h-[600px] min-w-[450px] min-h-[450px] p-5"> 
      
      {children}
    
    </div>
  );
}
