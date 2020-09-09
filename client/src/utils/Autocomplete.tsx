import React, { Fragment, useState, ChangeEvent } from "react";

interface IAutoCompleteProps<T> {
  name: string;
  label: string;
  items: T[];
  itemKey?: string;
}

interface IAutoCompleteState<T> {
  displayedItems: T[];
  active: boolean;
}

export default (props: IAutoCompleteProps<any>) => {
  const [autoCompleteState, setAutoCompleteState] = useState<
    IAutoCompleteState<any>
  >({
    displayedItems: [],
    active: true,
  });

  const filterItems = (filterValue: string): any[] => {
    const { items, itemKey } = props;
    let filteredItems: any[] = [];

    if (itemKey) {
      filteredItems = items.filter((item: any) => {
        return (
          filterValue !== "" && (item[itemKey] as string).includes(filterValue)
        );
      });
    } else {
      filteredItems = items.filter((item: string) => {
        return filterValue !== "" && item.includes(filterValue);
      });
    }

    return filteredItems;
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAutoCompleteState((priorState) => {
      return {
        ...priorState,
        displayedItems: filterItems(e.target.value),
      };
    });
  };

  return (
    <div className="autocomplete">
      <label htmlFor={props.name}>{props.label}</label>
      <input
        name={props.name}
        onChange={(e) => onChange(e)}
        type="text"
      ></input>
      {autoCompleteState.displayedItems.length > 0 &&
      autoCompleteState.active ? (
        <div className="autocomplete-results">
          <div className="result-row">test</div>
        </div>
      ) : null}
    </div>
  );
};
