module.exports = ({ env }) => ({
  extend: {
    contentTypesBuilder: {
      addSearchField: (schema, field) => {
        const type = schema.field(field).type;
        if (type === "richtext" || type === "longtext") {
          schema.field(field).searchable(true);
        }
      },
    },
  },
});
