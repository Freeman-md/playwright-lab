import { runDay1DropdownSelect } from "./flows/day1.dropdownSelect";
import { runDay1DynamicLoading } from "./flows/day1.dynamicLoading";
import { runDay1FormSubmit } from "./flows/day1.formSubmit";

const flows: Record<string, () => Promise<string | string[]>> = {
  "1": runDay1DynamicLoading,
  "2": runDay1FormSubmit,
  "3": runDay1DropdownSelect
};

async function main() {
  const choice = process.argv[2];

  if (!choice || !flows[choice]) {
    console.log(`
Choose a flow to run:

1 → Day 1: Dynamic Loading
2 → Day 1: Form Submit
3 → Day 1: Dropdown Select

Usage:
npx tsx src/index.ts <number>
`);
    process.exit(0);
  }

  const result = await flows[choice]();
  console.log("Result:", result);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
