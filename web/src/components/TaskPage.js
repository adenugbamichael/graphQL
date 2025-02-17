import React, { useState } from "react"

import { useStore } from "../store"
import NewApproach from "./NewApproach"
import Approach, { APPROACH_FRAGMENT } from "./Approach"
import TaskSummary, { TASK_SUMMARY_FRAGMENT } from "./TaskSummary"
import { gql, useQuery } from "@apollo/client"

export const FULL_TASK_FRAGMENT = `
  fragment FullTaskData on Task {
    id
    ...TaskSummary
    approachList {
      id
      ...ApproachFragment
    }
  }
  ${TASK_SUMMARY_FRAGMENT}
  ${APPROACH_FRAGMENT}
`

const TASK_INFO = gql`
  query taskInfo($taskId: ID!) {
    taskInfo(id: $taskId) {
      ...FullTaskData
    }
  }
  ${FULL_TASK_FRAGMENT}
`

export default function TaskPage({ taskId }) {
  const { AppLink } = useStore()
  // const [taskInfo, setTaskInfo] = useState(null)
  const [showAddApproach, setShowAddApproach] = useState(false)
  const [highlightedApproachId, setHighlightedApproachId] = useState()

  // useEffect(() => {
  //   if (!taskInfo) {
  //     query(TASK_INFO, { variables: { taskId } }).then(({ data }) => {
  //       setTaskInfo(data.taskInfo)
  //     })
  //   }
  // }, [taskId, taskInfo, query])

  const { error, loadding, data } = useQuery(TASK_INFO, {
    variables: { taskId },
  })

  if (error) {
    return <div className='error'>{error.message}</div>
  }

  if (loadding) {
    return <div className='loading'>Loading...</div>
  }

  const { taskInfo } = data

  const handleAddNewApproach = (addNewApproach) => {
    const newApproachId = addNewApproach(taskInfo)
    setHighlightedApproachId(newApproachId)
    setShowAddApproach(false)
  }

  return (
    <div>
      <AppLink to='Home'>{"<"} Home</AppLink>
      <TaskSummary task={taskInfo} />
      <div>
        <div>
          {showAddApproach ? (
            <NewApproach taskId={taskId} onSuccess={handleAddNewApproach} />
          ) : (
            <div className='center y-spaced'>
              <button
                onClick={() => setShowAddApproach(true)}
                className='btn btn-secondary'
              >
                + Add New Approach
              </button>
            </div>
          )}
        </div>
        <h2>Approaches ({taskInfo.approachList.length})</h2>
        {taskInfo.approachList.map((approach) => (
          <div key={approach.id} id={approach.id}>
            <Approach
              approach={approach}
              isHighlighted={highlightedApproachId === approach.id}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
