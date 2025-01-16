import React from 'react'

const CardView = () => {
  return (
      <div
          className={`grid grid-cols-1 place-items-center gap-y-12 pb-8 md:grid-cols-2 lg:gap-x-8 xl:gap-x-8 2xl:grid-cols-3  3xl:grid-cols-4 ${
            btnClick ? "backdrop-blur-md" : ""
          }`}
        >
          {data.map((month, index) => (
            <div key={index} className="mx-4">
              {cardData[month] && cardData[month].length > 0 ? (
                <HolidayCard
                  key={index}
                  cardData={cardData[month]}
                  month={month}
                />
              ) : (
                <HolidayCard key={index} month={month} />
              )}
            </div>
          ))}
        </div>
  )
}

export default CardView
