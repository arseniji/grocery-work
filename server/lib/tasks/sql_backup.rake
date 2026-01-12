namespace :db do
  desc "Backup the database with .sql extension"
  task sql_backup: :environment do
    config = Rails.configuration.database_configuration[Rails.env]
    backup_dir_path = "db/backups"
    db_name = config["database"]
    db_user = config["username"]
    db_port = config["port"] || 5432
    db_host = config["host"] || "localhost"
    db_password = config["password"]
    timestamp = Time.now.strftime("%Y%m%d%H%M%S")

    Dir.mkdir(backup_dir_path) unless Dir.exist?(backup_dir_path)
    Dir.mkdir("#{backup_dir_path}/sql") unless Dir.exist?("#{backup_dir_path}/sql")

    cmd = "PGPASSWORD='#{db_password}' pg_dump -U #{db_user} -h #{db_host} -p #{db_port} #{db_name} > #{backup_dir_path}/sql/db_#{timestamp}.sql"
    system(cmd) || raise("Backup failed!")
    puts "SQL Backup created: #{backup_dir_path}/sql/db_#{timestamp}.sql"
    puts db_name
  end
end
