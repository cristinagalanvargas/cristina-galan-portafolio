import { gql } from 'graphql-request';

export const homePageQuery = gql`
  query HomePage() {
    projects(orderBy: year_DESC) {
		id
		name
		slug
		year
		category {
			id
			name
		}
		type 
		coverImage {
			url
		}
	}
}
`;

export const singleProjectPageQuery = gql`
    query SingleProjectPage($slug: String!) {
        project(where: { slug: $slug }) {
            id
            name
            slug
            year
            agency
            client
            description
            category {
                id
                name
            }
            type
            coverImage {
                url
            }
            team {
                id
                role
                name
            }
            role
            video
            gallery {
                images {
                    id
                    url
                    width
                    height
                }
            }
        }
    }
`;

export const aboutPageQuery = gql`
  query AboutPage() {
	about(where: {uid: 1}) {
		bio
		profilePicture {
			url
		}
	}
	achievements {
		id
		name
		event {
			id
			institution
			link
			location
			year
			description
		}
	}
	clientPortfolio(where: {uid: 1}) {
    	client {
			id
      		name
      		logo {
        		url
      		}
    	}
  	}
}
`;

export const exposPageQuery = gql`
    query ExposPage {
        expos {
            id
            slug
            location
            color {
                hex
            }
            cover {
                url
            }
        }
    }
`;

export const singleExpoPageQuery = gql`
    query SingleExpoPage($slug: String!) {
        expo(where: { slug: $slug }) {
            id
            slug
            location
            cover {
                url
            }
            description
            gallery {
                images {
                    id
                    url
                    width
                    height
                }
            }
            name
            video
            year
            color {
                hex
            }
        }
    }
`;

export const contactPageQuery = gql`
    query ContatPage {
        contact(where: { uid: 1 }) {
            info {
                ... on Email {
                    id
                    name
                }
                ... on Social {
                    id
                    name
                }
            }
        }
    }
`;

export const reelPageQuery = gql`
  query ReelPage() {
	about(where: {uid: 1}) {
		reel
	}
}
`;
