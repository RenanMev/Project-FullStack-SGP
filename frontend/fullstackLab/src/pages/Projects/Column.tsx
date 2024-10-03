import React from 'react'
import { useDroppable } from '@dnd-kit/core'

export function Column(props: any) {
  const { setNodeRef } = useDroppable({
    id: props.column.id,
  })

  return (
    <div ref={setNodeRef} className="bg-card rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">{props.column.title}</h2>
      {props.children}
    </div>
  )
}