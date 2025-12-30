import { runSimplyShopWorkflow } from "./workflow";

async function main() {
  const result = await runSimplyShopWorkflow();
  console.log("Result:", result);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});