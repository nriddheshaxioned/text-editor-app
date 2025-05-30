interface IAutoCompleteListProps {
  options: string[];
  onSelect: (item: string) => void;
  activeIndex: number;
}

const AutoCompleteList: React.FC<IAutoCompleteListProps> = ({
  options,
  onSelect,
  activeIndex,
}) => {
  return (
    <ul
      className="w-[200px] block list-none z-50 p-2 border-1 border-gray-200 absolute top-3/4 bg-white max-h-[140] rounded-md shadow-2xl overflow-y-auto border-box list-inside-none"
    >
      {options.length > 0 ? (
        options.map((item, index) => (
          <li
            key={index}
            className={`p-2 cursor-pointer ${
              index === activeIndex ? "bg-blue-100" : "bg-white"
            }`}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(item);
            }}
          >
            {item}
          </li>
        ))
      ) : (
        <li>No suggestions found.</li>
      )}
    </ul>
  );
};

export default AutoCompleteList;