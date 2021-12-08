class Place {
  constructor(
    id,
    logBook_Id,
    recordType,
    title,
    date,
    description,
    imageUri,
    address,
    lat,
    lng
  ) {
    this.id = id;
    this.logBook_Id = logBook_Id;
    this.recordType = recordType;
    this.title = title;
    this.date = date;
    this.description = description;
    this.imageUri = imageUri;
    this.address = address;
    this.lat = lat;
    this.lng = lng;
  }
}

export default Place;
