"use client"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

export default function DndPage() {
  
    const items=[1,2,3,4,5,6,7,8,9]
  return (
      <DragDropContext onDragEnd={()=>{}}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-col gap-y-2"
            >
              {items.map((item, index) => (
                <Draggable key={item} draggableId={String(item)+"2"} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="w-10 h-10 bg-red-500"
                    >
                      {item}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
}
