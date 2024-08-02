import {
  Popover,
  Button,
  Checkbox,
  Divider,
  Space,
  Radio,
  RadioChangeEvent,
  Badge,
} from "antd";
import { keys } from "lodash";
import { useEffect, useState } from "react";

const CheckboxGroup = Checkbox.Group;

const plainOptions = ["Apple", "Pear", "Orange"];
const defaultCheckedList = ["Apple", "Orange"];

interface SortGroupItemProps {
  list: CommonOption[];
  label: string;
  handleChange: (value: string) => void;
  value: string;
  disabled?: boolean;
  onReset?: () => void;
}
function SortGroupItem(props: SortGroupItemProps) {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    props.handleChange(e.target.value);
  };

  const reset = () => {
    setValue(null);
    props.onReset?.();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1 text-xs">
        <p className="font-helvetica my-2 text-xs text-tertiary">
          {props.label}
        </p>
        {/* {!props.disabled && value && (
          <p onClick={reset} className="text-appBlue cursor-pointer">
            Reset
          </p>
        )} */}
      </div>
      {/* <div>
        <CheckboxGroup
          options={plainOptions}
          value={checkedList}
          onChange={onChange}
          className="flex flex-col gap-2"
        />
      </div> */}
      <Radio.Group disabled={props.disabled} onChange={onChange} value={value}>
        <Space direction="vertical">
          {props.list.map((item) => (
            <Radio key={item.value} value={item.value}>
              {item.label}
            </Radio>
          ))}
        </Space>
      </Radio.Group>
    </div>
  );
}

type CommonOption = {
  label: string;
  value: string;
};
const sortOptions = [
  {
    key: "timestamp",
    label: "Last Updated At",
    options: [
      { label: "Newest First", value: "desc" },
      { label: "Oldest First", value: "asc" },
    ],
  },
  {
    key: "displayTitle",
    label: "Title",
    options: [
      { label: "A-Z", value: "asc" },
      { label: "Z-A", value: "desc" },
    ],
  },
];

export interface SortBy {
  timestamp?: "asc" | "desc";
  displayTitle?: "asc" | "desc";
}

export const defaultSortBy: SortBy = {
  timestamp: "desc",
};

interface SortByModalProps {
  handleApply: (sortBy: SortBy) => void;
}
export default function SortByModal({
  handleApply: _handleApply,
}: SortByModalProps) {
  const [clicked, setClicked] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>(defaultSortBy);

  const handleClickChange = (open: boolean) => {
    setClicked(open);
  };

  const handleApply = () => {
    _handleApply(sortBy);
    setClicked(false);
  };

  const handleReset = () => {
    setSortBy(defaultSortBy);
    _handleApply(defaultSortBy);
    setClicked(false);
  };

  const renderContent = () => {
    return (
      <div>
        <Divider style={{ margin: "6px 0 10px" }} />
        <div>
          {sortOptions.map((sortGroup, index) => (
            <>
              <SortGroupItem
                key={sortGroup.label}
                list={sortGroup.options}
                label={sortGroup.label}
                // @ts-ignore
                value={sortBy[sortGroup.key]}
                handleChange={(value) => {
                  setSortBy((c) => ({
                    [sortGroup.key]: value,
                  }));
                }}
                // disabled={
                //   keys(sortBy).length > 0 && keys(sortBy)[0] !== sortGroup.key
                // }
                onReset={() => {
                  setSortBy({});
                }}
              />
              {index + 1 !== sortOptions.length && (
                <Divider style={{ margin: "8px 0" }} />
              )}
            </>
          ))}
        </div>
        <Divider style={{ margin: "6px 0 10px" }} />
        <div className="flex justify-between items-center">
          <Button onClick={handleReset} className="app-background" size="small">
            <span className="text-xs">Reset</span>
          </Button>

          <Button onClick={handleApply} className="app-primary" size="small">
            <span className="text-xs">Apply now</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Popover
      content={renderContent()}
      title="Sort by"
      trigger="click"
      open={clicked}
      onOpenChange={handleClickChange}
      placement="bottomRight"
      rootClassName="app-background"
      style={
        {
          // @ts-ignore
        }
      }
    >
      <Button className="app-background">Sort By</Button>
    </Popover>
  );
}
