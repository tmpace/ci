const AWS = require('aws-sdk');

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, CIRCLE_BUILD_NUM } = process.env;
const DOCKERFILE = `tmpace/ci-example:0.1.${CIRCLE_BUILD_NUM}`;

const ecs = new AWS.ECS({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1'
});

// Get a list of task definitions
ecs.listTaskDefinitions({ familyPrefix: 'ci-example' }, (err, data) => {
  if (err) {
    console.log(err);
  } else {
    // Get the last task
    let { taskDefinitionArns } = data;
    let latestTask = taskDefinitionArns[taskDefinitionArns.length - 1];
    
    // Describe the latest task definition
    ecs.describeTaskDefinition({ taskDefinition: latestTask }, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        let { taskDefinition } = data;
        registerTask(taskDefinition);
      }
    })
  }
});

function registerTask(taskDefinition) {
  console.log(taskDefinition);
  let { containerDefinitions } = taskDefinition;
  containerDefinitions[0]['image'] = DOCKERFILE;

  let newTaskDefinition = {
    containerDefinitions,
    family: 'ci-example'
  }

  ecs.registerTaskDefinition(newTaskDefinition, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let { taskDefinitionArn } = data.taskDefinition;
      updateService(taskDefinitionArn);
    }
  });
}

function updateService(taskDefinitionArn) {
  let params = {
    service: 'ci-example-service', 
    taskDefinition: taskDefinitionArn,
    cluster: 'ci-example-cluster'
  }

  ecs.updateService(params, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Success!!');
    }
  });
}

