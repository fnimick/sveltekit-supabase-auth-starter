export async function load({ locals: { session }, cookies }) {
	return {
		session,
		cookies: cookies.getAll()
	};
}
