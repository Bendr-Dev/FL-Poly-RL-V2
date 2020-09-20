import React, { Fragment, useState, ChangeEvent, FocusEvent } from "react";

interface IAutoCompleteProps<T> {
  name: string;
  label: string;
  items: T;
  itemKey: string;
  onSelectChange: (selection: any[]) => void;
}

interface IAutoCompleteState<T> {
  displayedItems: T[];
  active: boolean;
  selected: T[];
  filterValue: string;
}

export default <T extends { [key: string]: any }>(
  props: IAutoCompleteProps<T>
) => {
  const [autoCompleteState, setAutoCompleteState] = useState<
    IAutoCompleteState<any>
  >({
    displayedItems: [],
    active: false,
    selected: [],
    filterValue: "",
  });

  const filterItems = (filterValue: string): T[] => {
    const { items, itemKey } = props;
    let filteredItems: T[] = [];

    filteredItems = items.filter((item: T) => {
      return (
        filterValue !== "" &&
        (item[itemKey] as string).includes(filterValue) &&
        !autoCompleteState.selected.includes(item)
      );
    });

    return filteredItems;
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.persist();
    setAutoCompleteState((priorState) => {
      return {
        ...priorState,
        active: true,
        filterValue: e.target.value,
        displayedItems: filterItems(e.target.value),
      };
    });
  };

  const onFocus = (e: FocusEvent<HTMLInputElement>) => {
    setAutoCompleteState((priorState) => {
      return {
        ...priorState,
        active: true,
      };
    });
  };

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    setAutoCompleteState((priorState) => {
      return {
        ...priorState,
        active: false,
      };
    });
  };

  const onResultClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    item: any
  ) => {
    e.preventDefault();
    props.onSelectChange([...autoCompleteState.selected, item]);
    setAutoCompleteState((previousState) => {
      return {
        displayedItems: filterItems(""),
        active: false,
        selected: [...previousState.selected, item],
        filterValue: "",
      };
    });
  };

  const onCancelClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    index: number
  ) => {
    e.preventDefault();
    props.onSelectChange([
      ...autoCompleteState.selected.slice(0, index),
      ...autoCompleteState.selected.slice(index + 1),
    ]);
    setAutoCompleteState((previousState) => {
      return {
        ...previousState,
        displayedItems: filterItems(previousState.filterValue),
        active: false,
        selected: [
          ...previousState.selected.slice(0, index),
          ...previousState.selected.slice(index + 1),
        ],
      };
    });
  };

  const getHeight = () => {
    return autoCompleteState.displayedItems.length < 4
      ? { height: `${autoCompleteState.displayedItems.length * 50 + 5}px` }
      : { height: `205px` };
  };

  return (
    <Fragment>
      <label htmlFor={props.name}>{props.label}</label>
      <div className="autocomplete">
        <input
          name={props.name}
          value={autoCompleteState.filterValue}
          onFocus={(e) => onFocus(e)}
          onChange={(e) => onChange(e)}
          onBlur={(e) => onBlur(e)}
          autoComplete="off"
          type="text"
        ></input>
        {autoCompleteState.displayedItems.length > 0 &&
        autoCompleteState.active ? (
          <div className="autocomplete-results" style={getHeight()}>
            {autoCompleteState.displayedItems.map((item) => {
              return (
                <div
                  className="result-row"
                  key={item[props.itemKey]}
                  onMouseDown={(e) => {
                    onResultClick(e, item);
                  }}
                >
                  {item[props.itemKey]}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <ul className="autocomplete-selected-container">
        {autoCompleteState.selected.map((val: T, index: number) => {
          return (
            <li
              key={`li-${val[props.itemKey]}`}
              className="autocomplete-selected"
            >
              <i
                className="fa fa-times fa-xs"
                onClick={(e) => {
                  onCancelClick(e, index);
                }}
              ></i>{" "}
              {val[props.itemKey]}
            </li>
          );
        })}
      </ul>
    </Fragment>
  );
};
