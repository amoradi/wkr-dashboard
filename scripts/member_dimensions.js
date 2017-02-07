export default (props) => {
  return [
    {
      satisfactioninverse: props.satisfactioninverse,
      satisfaction: props.satisfaction
    },
    {
      clarityinverse: props.clarityinverse,
      clarity: props.clarity
    },
    {
      prodinverse: props.prodinvers,
      productivity: props.productivity
    },
    {
      stressinverse: props.stressinverse,
      stresslevel: props.stresslevel
    }, 
    {
      workloadinverse: props.workloadinverse,
      workload: props.workload
    }
  ]
}
