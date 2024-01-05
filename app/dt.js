"use client";
import Image from "next/image";
import React, { useRef, useEffect, useState, createRef } from "react";

export const Data = () => {
  const datas = [
    {
      id: 1,
      title: "The Art of Programming",
      subtitle: "Mastering the Coding Craft",
    },
    {
      id: 2,
      title: "Beyond the Horizon",
      subtitle: "Exploring the Unknown",
    },
    {
      id: 3,
      title: "Quantum Minds",
      subtitle: "Unraveling the Mysteries of Thought",
    },
    {
      id: 4,
      title: "The Silent Symphony",
      subtitle: "A Tale of Music and Emotion",
    },
    {
      id: 5,
      title: "Into the Wilderness",
      subtitle: "Surviving Nature's Challenges",
    },
  ];

  const [isActive, setIsActive] = useState();
  const ref = useRef();

  const dragStart = (e, index) => {
    setIsActive(index);
    const container = ref.current;
    const items = [...container.childNodes];
    const activeItem = items[index];
    const itemsBelow = items.slice(index + 1);
    const allOtherItems = items.filter((_, i) => i !== index);

    // Conotainer Size
    const boundingBox = activeItem.getBoundingClientRect();
    const space =
      items[1].getBoundingClientRect().top -
      items[0].getBoundingClientRect().bottom;

    // white space in the box
    const div = document.createElement("div");
    div.id = "div-temp";
    div.style.width = boundingBox.width + "px";
    div.style.height = boundingBox.height + "px";
    div.style.top = boundingBox.top + "px";
    div.style.left = boundingBox.left + "px";
    div.style.pointerEvents = "none";
    container.appendChild(div);

    // styling the item, to make it draggable
    activeItem.style.position = "fixed";
    activeItem.style.zIndex = 5000;
    activeItem.style.width = boundingBox.width + "px";
    activeItem.style.height = boundingBox.height + "px";
    activeItem.style.top = boundingBox.top + "px";
    activeItem.style.left = boundingBox.left + "px";
    activeItem.style.cursor = "grabbing";

    // Movement of inner items
    const distance = boundingBox.height + "px";
    itemsBelow.forEach((ite) => {
      ite.style.transform = `translateY(${distance} + ${space})`;
    });

    //mouse movement
    let x = e.clientX;
    let y = e.clientY;
    document.onpointermove = dragMove;

    function dragMove(e) {
      const posX = e.clientX - x;
      const posY = e.clientY - y;
      activeItem.style.transform = `translate(${posX}px, ${posY}px)`;
    }

    allOtherItems.forEach((item) => {
      const rect1 = activeItem.getBoundingClientRect();
      const rect2 = item.getBoundingClientRect();
      console.log(rect1, rect2);

      let isOverlaping =
        rect1.y < rect2.y + rect2.height / 2 &&
        rect1.y + rect1.height / 2 > rect2.y;

      if (isOverlaping) {
        if (item.getAttribute("style")) {
          item.style.transform = `translateY(${distance} + ${space})`;
          index++;
        } else {
          item.style.transform = `translateY(${distance} + ${space})`;
          index--;
        }
      }
    });

    //Ending
    document.onpointerup = dragEnd;
    function dragEnd() {
      document.onpointerup = "";
      setIsActive(undefined);
      activeItem.style = "";
      container.removeChild(div);
      items.forEach((item) => {
        item.style = "";
      });
    }
  };

  return (
    <div className=" flex-1 flex-col rounded-md border-[1px] border-[#f7f7f7] p-4 ">
      <div ref={ref}>
        {datas.map((points, index) => (
          <div
            key={`${index}${points.id}`}
            onPointerDown={(e) => dragStart(e, index)}
          >
            <div
              className={`${
                isActive == index ? "dragging" : ""
              } rounded-md my-2 border-solid border-[1px] border-[#f7f7f7] p-4`}
            >
              <div className="flex flex-col">
                <h2 className="text-[15px] font-bold m-2"> {points.title} </h2>
                <p className="text-[10px] mt-2"> {points.subtitle} </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
