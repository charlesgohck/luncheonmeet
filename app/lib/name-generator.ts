import { uniqueNamesGenerator, adjectives, colors, Config, animals } from 'unique-names-generator';

const config: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  seed: 'I love luncheonmeet!',
};

export default function generateUniqueUsername(email: string) {
  config.seed = `My email is ${email} and I love luncheonmeet.`
  return uniqueNamesGenerator(config);
}