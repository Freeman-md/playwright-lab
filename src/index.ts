import { runDay1DynamicLoading } from "./flows/day1.dynamicLoading";

async function main() {
    const result = await runDay1DynamicLoading()
    console.log('Day 1 result:', result);
}

main().catch(err => {
    console.error(err)
    process.exit(1)
})