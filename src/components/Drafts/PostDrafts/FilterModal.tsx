import {
  Popover,
  Button,
  Checkbox,
  Divider,
  Space,
  Radio,
  RadioChangeEvent,
  DatePicker,
  Select,
  Badge,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { set, values } from "lodash";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { PostFilters } from "./PostDraftsEntry";

const CheckboxGroup = Checkbox.Group;

const plainOptions = ["Apple", "Pear", "Orange"];
const defaultCheckedList = ["Apple", "Orange"];

interface SortGroupItemProps {
  list: string[];
  label: string;
}
const dateFormat = "YYYY/MM/DD";

type BaseFilterRef = {
  reset: () => void;
  getValues: () => any;
};

type MultiSelectFilterRef = {
  set: (value: string[]) => void;
} & BaseFilterRef;

type DateRangePickerRef = {
  set: ([startTime, endTime]: [
    startTime: Dayjs | null,
    endTime: Dayjs | null
  ]) => void;
} & BaseFilterRef;

interface DateRangeFilterProps {
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}
function DateRangeFilter(props: DateRangeFilterProps, ref: any) {
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().subtract(1, "week")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

  useImperativeHandle(ref, () => ({
    reset() {
      setStartDate(null);
      setEndDate(null);
    },
    set([startTime, endTime]: [
      startTime: Dayjs | null,
      endTime?: Dayjs | null
    ]) {
      startTime !== undefined && setStartDate(startTime);
      endTime !== undefined && setEndDate(endTime);
    },
    getValues() {
      return [startDate, endDate];
    },
  }));

  return (
    <div className="pt-1 pb-3">
      <div className="flex justify-between items-center mb-1.5 text-xs">
        <p>Date Range</p>
        <p className="text-appBlue cursor-pointer">Reset</p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {/* <DatePicker.RangePicker
          defaultValue={[dayjs().subtract(1, "week"), dayjs()]}
          format={dateFormat}
          rootClassName="app-dark-background"
          popupClassName="app-background"
        /> */}
        <label htmlFor="" className="w-full flex flex-col">
          <p className="text-[10px] font-helvetica text-tertiary">From:</p>
          <DatePicker
            value={startDate}
            onChange={(date) => setStartDate(date)}
            rootClassName="schedule-date-picker"
          />
        </label>
        <label htmlFor="" className="w-full flex flex-col">
          <p className="text-[10px] font-helvetica text-tertiary">To:</p>
          <DatePicker
            value={endDate}
            onChange={(date) => setEndDate(date)}
            rootClassName="schedule-date-picker"
          />
        </label>
      </div>
    </div>
  );
}

const DateRangeFiltersWithRef = forwardRef(DateRangeFilter);

const statusOptions = [
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
  { value: "scheduled", label: "Scheduled" },
];
interface StatusFilterProps {
  statusValue: string[];
}
function StatusFilter(props: StatusFilterProps, ref: any) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    setValue(props.statusValue);
  }, [props.statusValue]);

  useImperativeHandle(ref, () => ({
    reset() {
      setValue([]);
    },
    set(value: string[]) {
      setValue(value);
    },
    getValues() {
      return value;
    },
  }));

  return (
    <div className="pt-1 pb-3 max-w-[250px]">
      <div className="flex justify-between items-center mb-1 text-xs">
        <p>Status</p>
        <p className="text-appBlue cursor-pointer">Reset</p>
      </div>
      <div className="">
        <Select
          mode="tags"
          style={{ width: "100%" }}
          placeholder="Select Status"
          onChange={(values) => {
            setValue(values);
          }}
          options={statusOptions}
          rootClassName="app-dark-background"
          popupClassName="app-dark-background"
        />
      </div>
    </div>
  );
}

const StatusFilterWithRef = forwardRef(StatusFilter);

/**
 * Politics
 * Business
 * Technology
 * NetZero
 * Africa
 * Security
 * Media
 */

const topicOptions = [
  { value: "politics", label: "Politics" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "net-zero", label: "NetZero" },
  { value: "africa", label: "Africa" },
  { value: "security", label: "Security" },
  { value: "media", label: "Media" },
  { value: "others", label: "Others" },
];
interface TopicFilterProps {
  topicValue: string[];
}
function TopicFilter(props: TopicFilterProps, ref: any) {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    setValue(props.topicValue);
  }, [props.topicValue]);

  useImperativeHandle(ref, () => ({
    reset() {
      setValue([]);
    },
    set(value: string[]) {
      setValue(value);
    },
    getValues() {
      return value;
    },
  }));

  return (
    <div className="pt-1 pb-3 max-w-[250px]">
      <div className="flex justify-between items-center mb-1 text-xs">
        <p>Topic</p>
        <p className="text-appBlue cursor-pointer">Reset</p>
      </div>
      <div className="">
        <Select
          mode="tags"
          style={{ width: "100%" }}
          placeholder="Select Topics"
          onChange={(values: any) => {
            setValue(values);
          }}
          options={topicOptions}
          rootClassName="app-dark-background"
          popupClassName="app-dark-background"
        />
      </div>
    </div>
  );
}

const TopicFilterWithRef = forwardRef(TopicFilter);

interface FilterModalProps {
  filters: Pick<PostFilters, "dateRange" | "status" | "topics">;
  handleApply: (filters: any) => void;
}
export default function FilterModal(props: FilterModalProps) {
  const [clicked, setClicked] = useState(false);

  const dateRangeFilterRef = useRef<DateRangePickerRef>();
  const statusFilterRef = useRef<MultiSelectFilterRef>();
  const topicFilterRef = useRef<MultiSelectFilterRef>();

  const getAppliedFilterCount = () => {
    let count = 0;
    if (
      props.filters.dateRange[0] !== null ||
      props.filters.dateRange[1] !== null
    )
      count++;
    if (props.filters.status.length > 0) count++;
    if (props.filters.topics.length > 0) count++;
    return count;
  };

  useEffect(() => {
    if (clicked) {
      dateRangeFilterRef.current?.set(props.filters.dateRange);
      statusFilterRef.current?.set(props.filters.status);
      topicFilterRef.current?.set(props.filters.topics);
    }
  }, [
    clicked,
    props.filters.dateRange,
    props.filters.status,
    props.filters.topics,
  ]);

  const handleApply = () => {
    props.handleApply({
      dateRange: dateRangeFilterRef.current?.getValues(),
      status: statusFilterRef.current?.getValues(),
      topics: topicFilterRef.current?.getValues(),
    });
    setClicked(false);
  };

  const handleReset = () => {
    dateRangeFilterRef.current?.reset();
    statusFilterRef.current?.reset();
    topicFilterRef.current?.reset();
    props.handleApply({
      dateRange: [null, null],
      status: [],
      topics: [],
    });
    setClicked(false);
  };

  const handleClickChange = (open: boolean) => {
    setClicked(open);
  };

  const renderContent = () => {
    return (
      <div className="max-w-[250px]">
        <Divider style={{ margin: "4px 0" }} />
        <DateRangeFiltersWithRef
          ref={dateRangeFilterRef}
          startDate={props.filters.dateRange[0]}
          endDate={props.filters.dateRange[1]}
        />
        <Divider style={{ margin: "4px 0" }} />
        <StatusFilterWithRef
          ref={statusFilterRef}
          statusValue={props.filters.status}
        />
        <Divider style={{ margin: "4px 0" }} />
        <TopicFilterWithRef
          ref={topicFilterRef}
          topicValue={props.filters.topics}
        />
        <Divider style={{ margin: "4px 0 13px" }} />
        <div className="flex justify-between items-center">
          <Button
            onClick={handleReset}
            className="app-dark-background"
            size="small"
          >
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
      title="Filters"
      trigger="click"
      open={clicked}
      onOpenChange={handleClickChange}
      placement="bottomRight"
      rootClassName="app-background"
    >
      <Badge count={getAppliedFilterCount()}>
        <Button className="app-background">Filter</Button>
      </Badge>
    </Popover>
  );
}
