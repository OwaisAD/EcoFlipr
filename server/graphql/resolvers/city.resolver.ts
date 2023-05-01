import City from "../../models/city";

export const cityResolver = {
  Query: {
    getCityByZipCode: async (_parent: any, args: any, _context: any, _info: any) => {
      const zip_code = args.zip_code;

      try {
        const city = await City.findOne({ zip_code: zip_code });

        if (city == null) {
          throw new Error("City was not found");
        }
        

        return city;
      } catch (error: any) {
        throw new Error(error.message);
      }
    },
  },
};
