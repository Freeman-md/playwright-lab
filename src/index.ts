import { runDay1DynamicLoading } from './flows/day1.dynamicLoading';
import { runDay1FormSubmit } from './flows/day1.formSubmit';
import { runDay1DropdownSelect } from './flows/day1.dropdownSelect';
import { connectSpareRoom } from './flows/spareroom/connect';
import { checkSpareRoomSession } from './flows/spareroom/check';

const flows: Record<string, () => Promise<any>> = {
  '1': runDay1DynamicLoading,
  '2': runDay1FormSubmit,
  '3': runDay1DropdownSelect,
  '4': connectSpareRoom,        
  '5': checkSpareRoomSession,
};

async function main() {
  const choice = process.argv[2];

  if (!choice || !flows[choice]) {
    console.log(`
Choose a flow:

1 → Day 1: Dynamic Loading
2 → Day 1: Form Submit
3 → Day 1: Dropdown Select
4 → Connect SpareRoom (manual login)
5 → Check SpareRoom session (headless)

Usage:
npx tsx src/index.ts <number>
`);
    process.exit(0);
  }

  const result = await flows[choice]();
  if (result !== undefined) {
    console.log('Result:', result);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
