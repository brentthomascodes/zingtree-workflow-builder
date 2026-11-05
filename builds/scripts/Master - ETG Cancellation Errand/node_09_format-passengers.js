let selected_passengers = views.findorder;

const ALLOWED_KEYS = {
  passengerFirstName: "First Name",
  passengerLastName: "Last Name"
};

function formatPassengers(data) {
  return data
    .map(item =>
      Object.entries(ALLOWED_KEYS)
        .map(([key, label]) =>
          item[key]
            ? `<div><strong>${label}:</strong> ${item[key]}</div>`
            : ""
        )
        .join("")
    )
    .join('<hr style="margin: 8px 0;">');
}

let current_pnr = transforms.current_pnr;
current_pnr = {
    ...current_pnr,
    passengers: selected_passengers,
    formatted_passengers: formatPassengers(selected_passengers)
};

ZT.setTransformData("current_pnr", current_pnr);