export default function Card({ children }) {
  return (
    <div className="flex w-96 flex-col justify-center rounded-3xl px-5 py-16 align-middle shadow-[8px_4px_252px_19px_rgba(96,_18,_159,_0.55)]">
      {children}
    </div>
  );
}
