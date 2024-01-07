"use client";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { datas } from "./datas.js";

export function OrderedList() {
  const [isActive, setIsActive] = useState(undefined);
  const [listOfItems, setListOfItems] = useState(datas);
  const ref = useRef();

  function dragStart(e, index) {
    setIsActive(index);
    let container = ref.current;
    let items = [...container.childNodes];
    let activeData = listOfItems[index];
    let activeItem = items[index];
    let itemsBelow = items.slice(index + 1);
    let newData = listOfItems;

    // Conotainer Size
    const boundingBox = activeItem.getBoundingClientRect();
    const space =
      items[1].getBoundingClientRect().top -
      items[0].getBoundingClientRect().bottom;

    // styling the item, to make it draggable
    activeItem.style.position = "fixed";
    activeItem.style.zIndex = 5000;
    activeItem.style.width = boundingBox.width + "px";
    activeItem.style.height = boundingBox.height + "px";
    activeItem.style.top = boundingBox.top + "px";
    activeItem.style.left = boundingBox.left + "px";
    activeItem.style.cursor = "grabbing";

    // white space in the box
    const div = document.createElement("div");
    div.id = "div-temp";
    div.style.width = boundingBox.width + "px";
    div.style.height = boundingBox.height + "px";
    div.style.pointerEvents = "none";
    container.appendChild(div);

    // space shift
    const distance = boundingBox.height + space;
    itemsBelow.forEach((item) => {
      item.style.transform = `translateY(${distance}px)`;
      item.setAttribute("below", "");
    });

    //mouse movement
    let x = e.clientX;
    let y = e.clientY;
    const updt = [...ref.current.childNodes];
    const allOtherItems = updt.filter((_, i) => i !== index);
    document.onpointermove = dragMove;

    function dragMove(e) {
      const posX = e.clientX - x;
      const posY = e.clientY - y;
      activeItem.style.transform = `translateY(${posY}px) translateX(${posX}px)`;

      allOtherItems.forEach((item) => {
        const rect1 = activeItem.getBoundingClientRect();
        const rect2 = item.getBoundingClientRect();
        const rect3 = container.getBoundingClientRect();
        let isOverlaping =
          rect1.y < rect2.y + rect2.height / 2 &&
          rect1.y + rect1.height / 2 > rect2.y &&
          rect1.bottom < rect3.bottom &&
          rect1.top > rect3.top;
        if (isOverlaping && item.id !== "div-temp") {
          if (item.hasAttribute("below")) {
            item.style.transform = "";
            item.removeAttribute("below");
            if (index < 4) {
              index++;
            }
          } else {
            item.style.transform = `translateY(${distance}px)`;
            item.setAttribute("below", "");
            if (index > 0) {
              index--;
            }
          }
        }
      });
      console.log(index);
    }
    //Ending
    document.onpointerup = dragEnd;
    function dragEnd() {
      newData = listOfItems.filter((i) => i !== activeData);
      newData.splice(index, 0, activeData);
      document.onpointermove = "";
      document.onpointerup = "";
      activeItem.style = "";
      setIsActive(undefined);
      container.removeChild(div);
      items.forEach((item) => (item.style = ""));
      setListOfItems(newData);
    }
  }

  return (
    <div className=" flex-1 flex-col rounded-md border-[1px] border-[#1b1b1b] dark:border-[#f7f7f7]">
      <div ref={ref}>
        {listOfItems.map((points, index) => (
          <div
            key={`${index}${points.id}`}
            onPointerDown={(e) => dragStart(e, index)}
          >
            <div
              className={`${isActive == index ? "dragging shadow-md" : ""} ${
                isActive === undefined ? "" : "prevent-select"
              } rounded-md m-2 border-solid border-[1px] border-[#1b1b1b] dark:border-[#f7f7f7] p-4`}
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
}
