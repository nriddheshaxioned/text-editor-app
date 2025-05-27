const AutoCompleteList = ({ options, onSelect }) => {
    return (
        <ul
            style={{
                border: "1px solid #ccc",
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
