const AutoCompleteList = ({ options, onSelect }) => {
    return (
        <ul
            style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                display: "block",
                zIndex: 100,
                listStyle: "none",
                margin: 0,
                padding: "4px",
                position: "absolute",
                background: "white",
                maxHeight: 100,
                overflowY: "auto",
                width: "200px",
            }}
        >
            {options.map((item, index) => (
                <li
                    key={index}
                    style={{ padding: "4px", cursor: "pointer" }}
                    onMouseDown={(e) => {
                        e.preventDefault();
                        onSelect(item);
                    }}
                >
                    {item}
                </li>
            ))}
        </ul>
    );
}

export default AutoCompleteList;
