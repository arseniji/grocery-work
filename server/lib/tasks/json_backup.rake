require "json"
require "fileutils"

namespace :db do
  desc "Create a JSON backup of all tables in public schema (stream to file)"
  task json_backup: :environment do
    timestamp = Time.now.strftime("%Y%m%d%H%M%S")
    backup_dir = "db/backups/json"
    FileUtils.mkdir_p(backup_dir)
    backup_file = "#{backup_dir}/backup_#{timestamp}.json"

    tmp_schema = ActiveRecord::Base.connection.schema_search_path
    ActiveRecord::Base.connection.schema_search_path = "public"

    tables = ActiveRecord::Base.connection.tables.reject { |t| [ "schema_migrations", "ar_internal_metadata" ].include?(t) }

    File.open(backup_file, "w") do |f|
      f.write("{\n")
      tables.each_with_index do |table, index|
        columns = ActiveRecord::Base.connection.columns(table).map(&:name)

        f.write("  \"#{table}\": {\n")
        f.write("    \"columns\": #{columns.to_json},\n")
        f.write("    \"records\": [\n")

        first = true
        ActiveRecord::Base.connection.select_all("SELECT * FROM #{table}").each do |row|
          f.write(",\n") unless first
          f.write("      #{row.to_h.to_json}")
          first = false
        end

        f.write("\n    ]\n")
        f.write("  }")
        f.write(",\n") unless index == tables.size - 1
      end
      f.write("\n}\n")
    end

    puts "JSON backup created: #{backup_file}"
    ActiveRecord::Base.connection.schema_search_path = tmp_schema
  end
end
