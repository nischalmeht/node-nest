const { kafka } = require("./client");
const group = process.argv[2];
async function init() {
    // const groupId = "user-1";
    console.log("group===================>",group)
    const consumer = kafka.consumer({ groupId: group });
    // const consumer = kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topics: ["rider-updates"], fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message, heartbeat, pause }) => {
        console.log(
            `${group}: [${topic}]: PART:${partition}:`,
            message.value.toString()
          );
    }
  })
//   await consumer.disconnect()
}
init()