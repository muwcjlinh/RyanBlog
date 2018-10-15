// Set user info from request
export function setUserInfo(request) {
  return {
    _id: request._id,
    firstName: request.name.firstName,
    lastName: request.name.lastName,
    email: request.email,
    job: request.job,
    bio: request.bio,
    phone: request.phone,
    address: request.address,
    gender: request.gender,
    birth: request.birth
  };
}
